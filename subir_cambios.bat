@echo off
cd /d "C:\Users\ignac\proyectos\AGROMONITOREO"
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
git add -A
git commit -m "cambios %date% %time%"
git push origin main
echo.
echo === AGROMONITOREO subido - Vercel deployando ===
pause
