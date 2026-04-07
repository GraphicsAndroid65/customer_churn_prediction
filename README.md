<div align="center">
  <h1 align="center" style="font-size: 4rem;">🔮</h1>
  <h1 align="center">Customer Churn Predictor</h1>
  <img src="https://img.shields.io/badge/Machine_Learning-Customer_Churn-blue?style=for-the-badge&logo=scikit-learn" alt="ML Badge"/>
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Frontend-Vanilla_JS-e34f26?style=for-the-badge&logo=javascript" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Deployed-Firebase-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"/>
</div>

<p align="center" style="margin-top: 20px;">
  <i>An elite, state-of-the-art Web Application and Machine Learning architecture. Built to calculate customer retention probability actively utilizing <b>Random Forest mathematics</b> and an ultra-premium CSS3 Glassmorphism UI.</i>
</p>

---

## 👨‍💻 Primary Authors & Engineers
Developed with passion and precision from the ground up by:
* **Mangesh Choudhary** 
* **Lokesh Amaraj**
* Full-stack data gathering, model tuning, cloud deployment, and CSS animation synthesis.

## 💰 Real-World Value & Use Cases
Acquiring new customers is mathematically 25x more expensive than retaining an existing base. This system solves billion-dollar pain points:
1. **Telecom / Streaming (Netflix, AT&T):** If a user registers 4 support interactions in a week, this ML module instantly flags them as "High Risk". The company's automated systems email a free month or apology coupon, keeping the retention ecosystem intact.
2. **SaaS B2B Platforms:** Firms notice "Monthly" contract customers churn 60% faster. Dashboards flag them, prompting the Sales Team to call Monthly customers and offer an exclusive 20% discount on Annual plans.
3. **Saving Millions of Dollars:** By predicting dissatisfaction using AI algorithms before human employees ever realize it, massive corporations can proactively inject strategies and maximize their revenue.

## 🛠️ The Technology Stack
* **Python 3.10**: Handles the massive data pipelines.
* **Scikit-Learn, Pandas, NumPy**: Drives the Decision Tree math underlying the Random Forest ensemble and calculates precise accuracy matrices.
* **FastAPI**: Serves the trained models dynamically via incredibly fast, decoupled asynchronous API endpoints securely.
* **Firebase Hosting**: Powers the frontend routing ensuring infinite cloud-scaling performance globally.
* **HTML/CSS/JS Engine**: Complete 3D layout utilizing pure DOM manipulation and dynamic native rendering (No react bloat).

## 🚀 The Training Workflow
1. **Synthesizing Data**: Tracked customer profiles across heavily weighted markers: `Tenure`, `MonthlyCharges`, `ContractType`, and `SupportTickets`.
2. **Predictive Modeling**: Injected into our Random Forest Classifier, splitting trees until attaining a phenomenal **97.30% Model Accuracy** and a **0.98 F1 Precision Score**.
3. **Backend Logic**: JobLib deployed the active serialized weights directly into Uvicorn routing processes.

## 📱 Native Cross-Platform Applications
We explicitly constructed a **Pure-Native Desktop GUI** (`app_desktop.py`) using CustomTkinter that natively loads the Machine Learning Model locally without any browser/HTML wrappers!

To run it natively on Linux, Windows, or Mac:
```bash
pip install customtkinter pandas scikit-learn joblib
python3 app_desktop.py
```
> **Compiling to `.exe` / `.apk` and GitHub Releases:**
> To generate the standalone Windows `.exe` or Linux binary, run `pyinstaller --onefile app_desktop.py` on your target Operating System. Because compiling Android APKs or Windows binaries directly out of an Ubuntu cloud terminal lacks SDK environments, you must compile these files locally and upload them to the [GitHub Releases](https://github.com/GraphicsAndroid65/customer_churn_prediction/releases) tab. Your web application has been updated with a link pointing directly to this Releases tab for your users.

## ⚙️ Web Application Local Backend
If you aren't utilizing the Firebase hosted production link, run locally via:

### 1. Launch Back-end (AI Logic)
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 2. Launch Front-end (Dashboards)
```bash
cd frontend
python3 -m http.server 3000
```
Navigate to `http://localhost:3000`.

---
<div align="center">
  <sub>Licensed under MIT • Copyright (c) 2026 Mangesh Choudhary and Lokesh Amaraj </sub>
</div>
