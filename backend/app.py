from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="Customer Churn Prediction API")

# Setup CORS to allow the frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'models', 'churn_model.pkl')

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

class ChurnFeatures(BaseModel):
    Tenure: int
    MonthlyCharges: float
    TotalContacts: int
    ContractType: int # 0: Month-to-month, 1: One year, 2: Two year
    SupportTickets: int

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Churn Prediction API is running"}

@app.post("/predict")
def predict_churn(data: ChurnFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    # Convert input to DataFrame exactly matching training features
    input_data = {
        'Tenure': [data.Tenure],
        'MonthlyCharges': [data.MonthlyCharges],
        'TotalContacts': [data.TotalContacts],
        'ContractType': [data.ContractType],
        'SupportTickets': [data.SupportTickets]
    }
    df = pd.DataFrame(input_data)
    
    try:
        prediction = model.predict(df)[0]
        # Probability of class 1 (Churn)
        probability = model.predict_proba(df)[0][1] 
        
        return {
            "churn_prediction": int(prediction),
            "churn_probability": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
