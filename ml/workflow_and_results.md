# Customer Churn Prediction ML Module

## Workflow Overview
1. **Data Synthesis**: Generated a synthetic dataset with 5,000 customer records featuring `Tenure`, `MonthlyCharges`, `TotalContacts`, `ContractType`, and `SupportTickets`. 
2. **Preprocessing**: Split the data into training (80%) and test (20%) sets using `scikit-learn`.
3. **Model Selection**: A robust `RandomForestClassifier` (100 estimators, max depth 10) was used to learn patterns and non-linear feature interactions.
4. **Training & Evaluation**: The model was fitted on the training set and performed excellently on unseen test data.
5. **Artifact Generation**: The trained model (`churn_model.pkl`) and metadata were serialized via `joblib` for Fast API deployment.

## Model Performance Results
The model achieved a final accuracy of **97.30%**.

### Classification Report
| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| 0 (No Churn)| 0.97      | 0.99   | 0.98     | 660     |
| 1 (Churn)   | 0.98      | 0.94   | 0.96     | 340     |

### Feature Importance
Features ranked by their contribution to the model's predictions:
1. **ContractType**: 28.7%
2. **Tenure**: 27.7%
3. **MonthlyCharges**: 24.9%
4. **SupportTickets**: 16.2%
5. **TotalContacts**: 2.6%

## Deployment Readiness
The trained model (`models/churn_model.pkl`) is fully prepared to be integrated into the FastAPI backend, which will securely serve predictions to the frontend application.
