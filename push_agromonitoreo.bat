@echo off
cd /d "C:\Users\ignac\proyectos\AGROMONITOREO"
echo Eliminando lock files...
del /f /q ".git\refs\heads\main.lock" 2>nul
del /f /q ".git\objects\maintenance.lock" 2>nul
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
echo Pusheando a GitHub...
git push origin main
echo.
echo Listo! Presiona cualquier tecla para cerrar.
pause
