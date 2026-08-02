@echo off
cd /d "%~dp0"

REM Borra lock huerfano si quedo alguno (evita "index.lock: File exists")
if exist ".git\index.lock" del ".git\index.lock"

REM Mensaje del commit: si lo pasas como argumento se usa; si no, lo pregunta.
set "MSG=%*"
if "%MSG%"=="" set /p "MSG=Mensaje del commit (Enter = usar fecha/hora): "
if "%MSG%"=="" set "MSG=cambios %date% %time%"

echo.
echo === Subiendo cambios a GitHub ===
git add -A
git commit -m "%MSG%"
git push

echo.
echo === Listo ===
pause
