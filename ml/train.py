import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import json
import os

# Set seed for reproducibility
np.random.seed(42)
n_samples = 5000

# Generate synthetic dataset features
data = {
    'Tenure': np.random.randint(0, 72, n_samples),
    'MonthlyCharges': np.random.uniform(20.0, 150.0, n_samples),
    'TotalContacts': np.random.randint(0, 10, n_samples),
    'ContractType': np.random.choice([0, 1, 2], n_samples), # 0: Month-to-month, 1: One year, 2: Two year
    'SupportTickets': np.random.randint(0, 6, n_samples)
}

# Probability logic to generate churn based on features
# Higher churn if low tenure, high charges, high support tickets, and short contract
probability_churn = (
    0.3 * ((72 - data['Tenure']) / 72.0) +
    0.3 * (data['MonthlyCharges'] / 150.0) +
    0.2 * (data['SupportTickets'] / 5.0) +
    0.2 * (data['ContractType'] == 0).astype(int)
)

data['Churn'] = (probability_churn > 0.55).astype(int)

df = pd.DataFrame(data)

# Save synthetic dataset
os.makedirs('data', exist_ok=True)
df.to_csv('data/synthetic_churn_data.csv', index=False)
print("Synthetic dataset created with shape:", df.shape)

# Define X and y
X = df.drop('Churn', axis=1)
y = df['Churn']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
report = classification_report(y_test, y_pred, output_dict=True)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy:.4f}")

feature_importances = dict(zip(X.columns, model.feature_importances_))

# Save the trained model and metadata
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/churn_model.pkl')

with open('models/features.json', 'w') as f:
    json.dump(list(X.columns), f)

metrics = {
    'accuracy': accuracy,
    'report': report,
    'feature_importance': {k: float(v) for k, v in feature_importances.items()}
}
with open('models/metrics.json', 'w') as f:
    json.dump(metrics, f, indent=4)

print("Training finished. Artifacts saved in 'models/'.")
