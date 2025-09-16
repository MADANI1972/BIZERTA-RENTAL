@echo off
echo Installation de Bizerta_Rental...
echo.
echo Verification de Node.js...
node --version >nul 2>&
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installé
    echo Téléchargez-le depuis: https://nodejs.org/
    pause
    exit /b 
)

echo Installation des dépendances...
call npm install
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo ✅ Installation terminée !
echo.
echo Pour démarrer l'application:
echo   npm run dev

pause
