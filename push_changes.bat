@echo off
cd /d "C:\Users\ignac\OneDrive\Documentos\GitHub\AGROMONITOREO"
del .git\index.lock 2>nul
git push origin main
echo.
echo === AGROMONITOREO push done ===
pause
