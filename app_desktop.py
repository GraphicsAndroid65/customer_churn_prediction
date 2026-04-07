import customtkinter as ctk
import pandas as pd
import joblib
import os

# Set UI Theme Native
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ChurnApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("🔮 Customer Churn Engine (Native Edge)")
        self.geometry("500x700")
        self.resizable(False, False)

        # 1. Load ML Model
        self.model = None
        model_path = os.path.join(os.path.dirname(__file__), "ml", "models", "churn_model.pkl")
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            model_status = "✅ Random Forest Model Loaded"
        else:
            model_status = "❌ Model Missing (Run train.py first)"

        # 2. Header
        self.header = ctk.CTkLabel(self, text="Customer Churn Prediction", font=ctk.CTkFont(size=24, weight="bold"))
        self.header.pack(pady=(20, 5))
        
        self.status = ctk.CTkLabel(self, text=model_status, font=ctk.CTkFont(size=12), text_color="#10b981" if self.model else "#ef4444")
        self.status.pack(pady=(0, 20))

        # 3. Input Form
        self.form_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.form_frame.pack(fill="x", padx=40)

        # Tenure
        ctk.CTkLabel(self.form_frame, text="Tenure (Months):").grid(row=0, column=0, sticky="w", pady=10)
        self.tenure_val = ctk.CTkEntry(self.form_frame, width=150)
        self.tenure_val.insert(0, "12")
        self.tenure_val.grid(row=0, column=1, pady=10, padx=10)

        # Monthly Charges
        ctk.CTkLabel(self.form_frame, text="Monthly Charges ($):").grid(row=1, column=0, sticky="w", pady=10)
        self.charges_val = ctk.CTkEntry(self.form_frame, width=150)
        self.charges_val.insert(0, "50.0")
        self.charges_val.grid(row=1, column=1, pady=10, padx=10)

        # Total Contacts
        ctk.CTkLabel(self.form_frame, text="Support Interactions:").grid(row=2, column=0, sticky="w", pady=10)
        self.contacts_val = ctk.CTkEntry(self.form_frame, width=150)
        self.contacts_val.insert(0, "2")
        self.contacts_val.grid(row=2, column=1, pady=10, padx=10)

        # Open Tickets
        ctk.CTkLabel(self.form_frame, text="Active Tickets:").grid(row=3, column=0, sticky="w", pady=10)
        self.tickets_val = ctk.CTkEntry(self.form_frame, width=150)
        self.tickets_val.insert(0, "1")
        self.tickets_val.grid(row=3, column=1, pady=10, padx=10)

        # Contract Type
        ctk.CTkLabel(self.form_frame, text="Contract Type:").grid(row=4, column=0, sticky="w", pady=10)
        self.contract_val = ctk.CTkOptionMenu(self.form_frame, values=["Monthly", "1 Year", "2 Years"], width=150)
        self.contract_val.grid(row=4, column=1, pady=10, padx=10)

        # AutoPay
        self.autopay_val = ctk.CTkCheckBox(self.form_frame, text="Auto-Pay Enabled", onvalue=1, offvalue=0)
        self.autopay_val.select()
        self.autopay_val.grid(row=5, column=0, columnspan=2, pady=20)

        # Predict Button
        self.predict_btn = ctk.CTkButton(self, text="Execute Analytics", command=self.run_prediction, 
                                         font=ctk.CTkFont(size=15, weight="bold"), height=45)
        self.predict_btn.pack(pady=20, padx=40, fill="x")

        # Result Display
        self.result_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="#1e1e2f")
        self.result_frame.pack(fill="x", padx=40, pady=10, ipady=15)
        
        self.result_prob = ctk.CTkLabel(self.result_frame, text="--%", font=ctk.CTkFont(size=45, weight="bold"))
        self.result_prob.pack(pady=(10,0))
        
        self.result_desc = ctk.CTkLabel(self.result_frame, text="Awaiting Input...", font=ctk.CTkFont(size=14))
        self.result_desc.pack()

    def run_prediction(self):
        if not self.model:
            self.result_desc.configure(text="Error: ML Model not compiled.", text_color="#ef4444")
            return
        
        try:
            # Map Inputs
            t = int(self.tenure_val.get())
            mc = float(self.charges_val.get())
            tc = int(self.contacts_val.get())
            st = int(self.tickets_val.get())
            
            c_str = self.contract_val.get()
            ctype = 0 if c_str == "Monthly" else (1 if c_str == "1 Year" else 2)
            
            ap = self.autopay_val.get()
            
            # Create DataFrame ensuring order matches train.py (Tenure, MonthlyCharges, TotalContacts, ContractType, SupportTickets)
            input_df = pd.DataFrame([{
                'Tenure': t,
                'MonthlyCharges': mc,
                'TotalContacts': tc,
                'ContractType': ctype,
                'SupportTickets': st
            }])
            
            # Predict
            prob = self.model.predict_proba(input_df)[0][1] * 100
            if ap == 1: 
                prob -= 5 # apply UI level discount if autopay
                prob = max(prob, 0)
            
            self.result_prob.configure(text=f"{prob:.1f}%")
            
            if prob > 50:
                self.result_desc.configure(text="High Risk of Churn", text_color="#facc15" if prob < 75 else "#ef4444")
                self.result_prob.configure(text_color="#ef4444")
            else:
                self.result_desc.configure(text="Healthy Customer Profile", text_color="#10b981")
                self.result_prob.configure(text_color="#10b981")
                
        except Exception as e:
            self.result_desc.configure(text=f"Input Error", text_color="#ef4444")
            print(e)
            
if __name__ == "__main__":
    app = ChurnApp()
    app.mainloop()
