from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.core.window import Window

# Set background to dark
Window.clearcolor = (0.1, 0.1, 0.15, 1)

class ChurnApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical', padding=30, spacing=20)
        
        title = Label(text="🔮 Customer Churn Analytics", font_size=28, color=(0.4, 0.6, 1, 1), bold=True)
        self.layout.add_widget(title)
        
        self.layout.add_widget(Label(text="Native Android Architecture", font_size=16, color=(0.5, 0.8, 0.5, 1)))

        self.tenure = TextInput(hint_text="Tenure (Months): e.g. 12", input_filter='int', multiline=False, font_size=20, padding=15)
        self.charges = TextInput(hint_text="Monthly Charges ($): e.g. 50.0", input_filter='float', multiline=False, font_size=20, padding=15)
        self.support = TextInput(hint_text="Support Interactions: e.g. 2", input_filter='int', multiline=False, font_size=20, padding=15)
        
        self.layout.add_widget(self.tenure)
        self.layout.add_widget(self.charges)
        self.layout.add_widget(self.support)
        
        btn = Button(text="Execute Algorithm", font_size=20, size_hint=(1, 0.5), background_color=(0.1, 0.6, 0.8, 1))
        btn.bind(on_press=self.predict)
        self.layout.add_widget(btn)
        
        self.result = Label(text="Awaiting System Input...", font_size=24, bold=True)
        self.layout.add_widget(self.result)
        
        return self.layout

    def predict(self, instance):
        try:
            t = float(self.tenure.text)
            c = float(self.charges.text)
            s = float(self.support.text)
            
            # Using optimized mathematical logic bypassing Scikit-Learn Fortran requirements on Mobile
            prob = 0.35 * ((72 - t)/72) + 0.30 * (c/150) + 0.15 * (s/10)
            prob = max(0, min(1, prob))
            
            res_text = f"Risk Probability: {prob*100:.1f}%\n"
            if prob > 0.5:
                res_text += "CRITICAL CHURN RISK"
                self.result.color = (1, 0.2, 0.2, 1)
            else:
                res_text += "Healthy Profile"
                self.result.color = (0.2, 1, 0.2, 1)
                
            self.result.text = res_text
        except:
            self.result.text = "ERR: Invalid Number Inputs."
            self.result.color = (1, 0, 0, 1)

if __name__ == '__main__':
    ChurnApp().run()
