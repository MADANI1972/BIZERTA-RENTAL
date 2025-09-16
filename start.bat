@echo off
echo Démarrage de Bizerta_Rental...
echo.
echo Backend sur http://localhost:5000
echo Frontend sur http://localhost:3000
echo.
start "Bizerta_Rental Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Bizerta_Rental Frontend" cmd /k "cd frontend && npm start"

echo Les deux serveurs démarrent...
timeout /t 5 /nobreak >nul
start http://localhost:3000
