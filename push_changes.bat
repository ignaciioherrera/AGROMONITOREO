@echo off
cd /d "C:\Users\ignac\proyectos\AGROMONITOREO"
del .git\index.lock 2>nul
git push origin main
echo.
echo === AGROMONITOREO push done ===
pause
