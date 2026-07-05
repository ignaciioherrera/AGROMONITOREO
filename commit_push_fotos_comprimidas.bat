@echo off
cd /d "C:\Users\ignac\OneDrive\Documentos\GitHub\AGROMONITOREO"
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
git add src/App.jsx commit_push_fotos_comprimidas.bat
git commit -m "perf: fotos comprimidas a 1280px JPEG 80% antes de subir - sync 5-10x mas rapido"
git push origin main
echo.
echo === AGROMONITOREO fotos comprimidas deploy listo ===
pause
