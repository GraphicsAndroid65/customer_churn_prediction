#!/bin/bash
echo "=========================================================="
echo " CUSTOMER CHURN PREDICTOR - ANDROID APK NATIVE COMPILER"
echo "=========================================================="
echo ""

echo "[1/4] Installing Buildozer and Cython dependencies..."
pip install buildozer cython

echo "[2/4] Initializing Buildozer Android Spec..."
buildozer init

echo "[3/4] Configuring buildozer.spec for Machine Learning libs..."
sed -i 's/requirements = python3,kivy/requirements = python3,customtkinter,pandas,scikit-learn,joblib/' buildozer.spec

echo "[4/4] Compiling Native Android APK (This will download Android NDK/SDK and may take ~20 mins)..."
buildozer -v android debug

echo ""
echo "Build Complete! Check the 'bin' folder for your .apk!"
