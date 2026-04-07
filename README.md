<div align="center">
  <img src="https://img.shields.io/badge/Machine_Learning-Customer_Churn-blue?style=for-the-badge&logo=scikit-learn" alt="ML Badge"/>
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-e34f26?style=for-the-badge&logo=html5" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Deployed-Firebase-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"/>
</div>

<h1 align="center">🔮 Customer Churn Predictor</h1>

<p align="center">
  <i>A state-of-the-art Web Application and Machine Learning module designed to accurately predict customer churn rates using advanced Random Forest modeling and a sleek, dynamic web interface.</i>
</p>

---

## ✨ Features

- **🧠 Advanced ML Engine:** Developed a highly accurate `RandomForestClassifier` trained on robust synthetic data.
- **⚡ Supercharged API:** Leverages FastAPI for ultra-fast, asynchronous prediction serving.
- **🎨 Stunning Interface:** Features advanced **Glassmorphism**, reactive SVG gauges, and silky-smooth animations.
- **☁️ Cloud Ready:** Configured to push effortlessly to Google Firebase.

## 🚀 Workflow Mechanics

1. **Data Engineering**: Synthesized and preprocessed a dataset tracking `Tenure`, `MonthlyCharges`, `ContractType`, and `SupportTickets`.
2. **Predictive Modeling**: Trained a Random Forest ensemble model reaching an exceptional accuracy of **97.3%**.
3. **Backend Integration**: Serialized the intelligent model and exposed it behind a decoupled FastAPI REST architecture (`/predict`).
4. **Frontend Analytics**: Engineered a beautifully responsive HTML/CSS/JS frontend to render real-time risk scores via API queries.

## 🛠️ Local Installation & Usage

### 1. Requirements Setup
Clone the repository and install the Python dependencies.

```bash
git clone https://github.com/AIGamerx/customer_churn_prediction.git
cd customer_churn_prediction
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Launch the Brain (FastAPI Backend)
To serve the ML model to your frontend:
```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 3. Launch the Dashboard (Frontend)
Open up a new terminal window:
```bash
cd frontend
python3 -m http.server 3000
```
Navigate your browser to `http://localhost:3000` to interact with the dashboard!

## 📈 Performance Intelligence
The model identifies the risk with extreme precision reporting an F1-score of **0.96 for Churners** and **0.98 for Safe Customers**. The top algorithmic driving feature is `ContractType` safely confirming business theories.

<br>
<div align="center">
  <sub>Built thoughtfully with passion and precision.</sub>
</div>
