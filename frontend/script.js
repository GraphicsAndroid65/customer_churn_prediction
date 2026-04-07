document.addEventListener("DOMContentLoaded", () => {
    // Advanced SVG Gauge initialization
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "gradient");
    
    // Smooth transition from healthy (blue/green) to danger (orange/red)
    const stop1 = document.createElementNS(svgNS, "stop"); stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", "#00f2fe");
    const stop2 = document.createElementNS(svgNS, "stop"); stop2.setAttribute("offset", "50%"); stop2.setAttribute("stop-color", "#4facfe");
    const stop3 = document.createElementNS(svgNS, "stop"); stop3.setAttribute("offset", "100%"); stop3.setAttribute("stop-color", "#ff0844");
    
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    linearGradient.appendChild(stop3);
    defs.appendChild(linearGradient);
    document.querySelector('.gauge').prepend(defs);

    const form = document.getElementById("churn-form");
    const btn = document.querySelector(".primary-btn");
    const resultPanel = document.getElementById("result-panel");
    const gaugePath = document.getElementById("gauge-path");
    const probText = document.getElementById("probability-text");
    const statusText = document.getElementById("churn-status-text");
    const detailsText = document.getElementById("churn-details");

    const animateGaugeAndNumbers = (probability, isHighRisk) => {
        // Native numerical counter animation
        let current = 0;
        let step = probability > 50 ? 2 : 1;
        
        // Remove previous risk classes
        resultPanel.classList.remove("risk-high", "risk-moderate", "risk-low");
        
        setTimeout(() => {
            resultPanel.classList.add("show");
            
            // Animate SVG gauge path
            // Max arc length is roughly 125. Lower offset = fuller gauge.
            const offset = 125 - (125 * probability / 100);
            gaugePath.style.strokeDashoffset = offset;
            
            const interval = setInterval(() => {
                if (current >= parseFloat(probability)) {
                    clearInterval(interval);
                    probText.innerText = probability;
                } else {
                    current += step;
                    probText.innerText = Math.min(current, parseFloat(probability)).toFixed(1);
                }
            }, 16);
            
            if (isHighRisk || probability > 60) {
                resultPanel.classList.add("risk-high");
                statusText.innerText = "Critical Churn Risk";
                detailsText.innerText = "Urgent: Customer is extremely likely to leave. Deploy retention strategies immediately.";
            } else if (probability > 30) {
                resultPanel.classList.add("risk-moderate");
                statusText.innerText = "Moderate Warning";
                detailsText.innerText = "Customer showing signs of dissatisfaction. Proactive check-in recommended.";
            } else {
                resultPanel.classList.add("risk-low");
                statusText.innerText = "Healthy Status";
                detailsText.innerText = "Excellent retention forecast. Customer profile is stable and loyal.";
            }
            
            btn.classList.remove("loading");
        }, 300);
    };

    const fetchPrediction = async () => {
        btn.classList.add("loading");
        resultPanel.classList.remove("show");
        gaugePath.style.strokeDashoffset = 125; // Reset gauge
        
        const formData = new FormData(form);
        const payload = {
            Tenure: parseInt(formData.get("tenure")),
            MonthlyCharges: parseFloat(formData.get("monthlyCharges")),
            TotalContacts: parseInt(formData.get("totalContacts")),
            ContractType: parseInt(formData.get("contractType")),
            SupportTickets: parseInt(formData.get("supportTickets"))
        };
        
        try {
            // Attempt real FastAPI backend call
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error("API Network Error");
            
            const data = await response.json();
            const probability = (data.churn_probability * 100).toFixed(1);
            const isHighRisk = data.churn_prediction === 1;
            
            animateGaugeAndNumbers(probability, isHighRisk);
            
        } catch (err) {
            console.warn("Backend unavailable. Fallback to local heuristic simulation for UI demonstration.");
            // Advanced frontend-only heuristic simulating the ML model behavior if backend is unreachable
            let mockProb = 
                0.35 * ((72 - payload.Tenure)/72) + 
                0.30 * (payload.MonthlyCharges/150) + 
                0.15 * (payload.SupportTickets/5) + 
                0.20 * (payload.ContractType === 0 ? 1 : 0);
                
            mockProb = Math.min(Math.max(mockProb, 0), 1); // Clamp between 0 and 1
            const probability = (mockProb * 100).toFixed(1);
            const isHighRisk = mockProb > 0.55;
            
            setTimeout(() => {
                animateGaugeAndNumbers(probability, isHighRisk);
                // Tag the output to show it's simulated
                document.querySelector('.ml-badge').innerText = "Simulation Mode";
                document.querySelector('.ml-badge').style.background = "#fbbf24";
                document.querySelector('.ml-badge').style.color = "#000";
            }, 600); // Simulate network delay
        }
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // crucial to prevent the page reload
        fetchPrediction();
    });

    // Fix the initial load loop by calling fetch directly instead of form dispatch
    setTimeout(() => {
        fetchPrediction();
    }, 400);

    // Interactive card tilts for ultra-premium UX
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });
});
