document.addEventListener("DOMContentLoaded", () => {
    // 1. Splash Screen Logic
    const splash = document.getElementById("splash-screen");
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.visibility = 'hidden'; }, 800);
    }, 2000); // 2 second mock load screen

    // 2. Modals Logic
    const modals = {
        'nav-about-app': document.getElementById('modal-about'),
        'nav-dev-info': document.getElementById('modal-dev'),
        'nav-settings': document.getElementById('modal-settings')
    };

    Object.keys(modals).forEach(linkId => {
        const link = document.getElementById(linkId);
        if(link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                modals[linkId].classList.add('active');
            });
        }
    });

    // Close modals
    document.querySelectorAll('.close-modal, .close-btn, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if(e.target === el) { // ensures clicking inside modal content doesn't close it
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            }
        });
    });

    // 3. SVG Gauge Initialization
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "gradient");
    
    const stop1 = document.createElementNS(svgNS, "stop"); stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", "#00f2fe");
    const stop2 = document.createElementNS(svgNS, "stop"); stop2.setAttribute("offset", "50%"); stop2.setAttribute("stop-color", "#4facfe");
    const stop3 = document.createElementNS(svgNS, "stop"); stop3.setAttribute("offset", "100%"); stop3.setAttribute("stop-color", "#ff0844");
    
    linearGradient.appendChild(stop1); linearGradient.appendChild(stop2); linearGradient.appendChild(stop3);
    defs.appendChild(linearGradient);
    document.querySelector('.gauge').prepend(defs);

    const form = document.getElementById("churn-form");
    const btn = document.querySelector(".primary-btn");
    const resultPanel = document.getElementById("result-panel");
    const gaugePath = document.getElementById("gauge-path");
    const probText = document.getElementById("probability-text");
    const statusText = document.getElementById("churn-status-text");
    const detailsText = document.getElementById("churn-details");
    const mlBadge = document.querySelector('.ml-badge');

    const animateGaugeAndNumbers = (probability, isHighRisk) => {
        let current = 0;
        let step = probability > 50 ? 2 : 1;
        
        resultPanel.classList.remove("risk-high", "risk-moderate", "risk-low");
        
        setTimeout(() => {
            resultPanel.classList.add("show");
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
                statusText.innerText = "Critical Probability";
                detailsText.innerText = "Action required: Customer exhibits intense dissatisfaction markers and will likely discontinue service.";
                statusText.style.color = '#f87171';
            } else if (probability > 30) {
                resultPanel.classList.add("risk-moderate");
                statusText.innerText = "Moderate Warning";
                detailsText.innerText = "Caution: Some variables align with historical churn data. Proactive outreach recommended.";
                statusText.style.color = '#fbbf24';
            } else {
                resultPanel.classList.add("risk-low");
                statusText.innerText = "Healthy Predictor";
                detailsText.innerText = "Stable. The algorithm calculates minimal risk of churn based on current contract dynamics.";
                statusText.style.color = '#34d399';
            }
            btn.classList.remove("loading");
        }, 300);
    };

    const fetchPrediction = async () => {
        btn.classList.add("loading");
        resultPanel.classList.remove("show");
        gaugePath.style.strokeDashoffset = 125;
        
        const formData = new FormData(form);
        // Autopay gives a slight deduction in risk in simulation mode, dynamic interaction
        const isAutoPay = document.getElementById('autopay').checked;
        
        const payload = {
            Tenure: parseInt(formData.get("tenure")),
            MonthlyCharges: parseFloat(formData.get("monthlyCharges")),
            TotalContacts: parseInt(formData.get("totalContacts")),
            ContractType: parseInt(formData.get("contractType")),
            SupportTickets: parseInt(formData.get("supportTickets"))
        };
        
        try {
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("API Offline");
            
            const data = await response.json();
            let probabilityStr = (data.churn_probability * 100).toFixed(1);
            let probabilityNum = parseFloat(probabilityStr);
            if(isAutoPay) probabilityNum = Math.max(0, probabilityNum - 5); // reduce risk slightly if autopay
            
            mlBadge.innerText = "Live Python Predictor";
            mlBadge.style.background = "var(--secondary-gradient)";
            animateGaugeAndNumbers(probabilityNum.toFixed(1), probabilityNum > 50);
            
        } catch (err) {
            // Simulated local algorithm to mimic our Random Forest Math
            let mockProb = 
                0.35 * ((72 - payload.Tenure)/72) + 
                0.30 * (payload.MonthlyCharges/150) + 
                0.15 * (payload.SupportTickets/10) + 
                0.20 * (payload.ContractType === 0 ? 1 : (payload.ContractType === 1 ? 0.4 : 0));
                
            if(isAutoPay) mockProb -= 0.05; // 5% reduction on mock prob string
            
            mockProb = Math.min(Math.max(mockProb, 0), 1);
            const probability = (mockProb * 100).toFixed(1);
            
            setTimeout(() => {
                mlBadge.innerText = "JS Inference Alg";
                mlBadge.style.background = "#06b6d4";
                animateGaugeAndNumbers(probability, mockProb > 0.55);
            }, 600);
        }
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        fetchPrediction();
    });

    // 4. Functional Settings Menu
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.addEventListener('change', (e) => {
        if (e.target.value === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });

    const exportBtn = document.getElementById('export-csv-btn');
    exportBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const tenure = formData.get("tenure");
        const charges = formData.get("monthlyCharges");
        const contacts = formData.get("totalContacts");
        const tickets = formData.get("supportTickets");
        // Convert contract type to readable string for csv
        const contractRaw = formData.get("contractType");
        const contractStr = contractRaw === '0' ? 'Monthly' : (contractRaw === '1' ? '1 Year' : '2 Years');
        const autopay = document.getElementById('autopay').checked ? "Yes" : "No";
        
        let currProb = probText.innerText;
        let currStatus = statusText.innerText;
        
        // Ensure probability evaluates
        if (!currProb || currProb === "0") {
             currProb = "N/A";
             currStatus = "Not Computed";
        }
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Tenure (Months),Monthly Charges ($),Total Contacts,Open Tickets,Contract Type,Auto-Pay,Churn Probability,Algorithm Status\n"
            + `${tenure},${charges},${contacts},${tickets},${contractStr},${autopay},${currProb}%,${currStatus}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customer_analytics_export.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        exportBtn.innerText = "Downloaded! ✓";
        setTimeout(() => { exportBtn.innerText = "Download CSV"; }, 2000);
    });
});
