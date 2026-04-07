document.addEventListener("DOMContentLoaded", () => {
    // Add SVG defs for gradients (for the animated gauge)
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "gradient");
    
    // Gradient interpolates from green to red based on percentage but we'll just set a multi-color gradient
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#3b82f6");
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "50%");
    stop2.setAttribute("stop-color", "#f59e0b");

    const stop3 = document.createElementNS(svgNS, "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#ef4444");
    
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
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Show loading state
        btn.classList.add("loading");
        resultPanel.classList.add("fade-out");
        resultPanel.classList.remove("risk-high");
        gaugePath.style.strokeDashoffset = 125; // Reset gauge
        
        // Gather data
        const formData = new FormData(form);
        const payload = {
            Tenure: parseInt(formData.get("tenure")),
            MonthlyCharges: parseFloat(formData.get("monthlyCharges")),
            TotalContacts: parseInt(formData.get("totalContacts")),
            ContractType: parseInt(formData.get("contractType")),
            SupportTickets: parseInt(formData.get("supportTickets"))
        };
        
        try {
            // Call FastAPI backend
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error("API call failed");
            
            const data = await response.json();
            const probability = (data.churn_probability * 100).toFixed(1);
            const isHighRisk = data.churn_prediction === 1;
            
            // Artificial delay to show nice loading animation
            setTimeout(() => {
                // Update result panel
                resultPanel.classList.remove("fade-out");
                
                // Animate gauge 
                const offset = 125 - (125 * probability / 100);
                setTimeout(() => {
                    gaugePath.style.strokeDashoffset = offset;
                }, 50); 
                
                // Native numerical counter animation
                let current = 0;
                let step = probability > 50 ? 2 : 1;
                const interval = setInterval(() => {
                    if (current >= parseFloat(probability)) {
                        clearInterval(interval);
                        probText.innerText = probability;
                    } else {
                        current += step;
                        probText.innerText = Math.min(current, parseFloat(probability)).toFixed(1);
                    }
                }, 20);
                
                if (isHighRisk || probability > 50) {
                    resultPanel.classList.add("risk-high");
                    statusText.innerText = "High Churn Risk";
                    detailsText.innerText = "This customer is highly likely to churn. Consider offering retention incentives or reaching out to them immediately.";
                } else if (probability > 30) {
                    statusText.innerText = "Moderate Risk";
                    detailsText.innerText = "This customer exhibits some signs of dissatisfaction. Proactive outreach is recommended.";
                } else {
                    statusText.innerText = "Low Risk";
                    detailsText.innerText = "This customer is stable and extremely likely to stay. No immediate action required.";
                }
                
                btn.classList.remove("loading");
            }, 800);
            
        } catch (err) {
            console.error(err);
            alert("Failed to connect to the prediction backend.");
            btn.classList.remove("loading");
        }
    });

    // Handle initial UI state
    setTimeout(() => {
        form.dispatchEvent(new Event("submit"));
    }, 500);
});
