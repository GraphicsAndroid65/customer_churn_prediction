@echo off
echo ========================================================
echo CUSTOMER CHURN PREDICTOR - WINDOWS EXECUTABLE COMPILER
echo ========================================================
echo.
echo Installing Python dependencies for Windows...
pip install customtkinter pandas scikit-learn joblib pyinstaller

echo.
echo Compiling Windows Native Exe (Customer_Churn_Predictor_Native.exe)...
pyinstaller --onefile --windowed --noconsole --name "Customer_Churn_Predictor_Native" app_desktop.py

echo.
echo Build Complete! Check the 'dist' folder for your high-performance .exe file.
pause
