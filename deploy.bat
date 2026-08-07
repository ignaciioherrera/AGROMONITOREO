@echo off
REM ============================================================
REM  Deploy AGROMONITOREO (app del monitoreador)
REM  Limpia el lock de git, compila, commitea TODO y pushea.
REM  Doble clic o ejecuta desde la carpeta del repo.
REM ============================================================
setlocal
cd /d "%~dp0"

REM Evita que los warnings de react-scripts corten el build
set CI=false

echo.
echo === 1/5 Limpiando lock de git (si existe) ===
if exist ".git\index.lock" del /f /q ".git\index.lock"

echo.
echo === 2/5 Compilando (npm run build) ===
if not exist "node_modules\.bin\react-scripts.cmd" (
  echo Dependencias no instaladas. Corriendo npm install ^(puede tardar unos minutos^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERROR: npm install fallo.
    pause
    exit /b 1
  )
)
call npm run build
if errorlevel 1 (
  echo.
  echo ERROR: el build fallo. No se hace commit ni push.
  pause
  exit /b 1
)

echo.
echo === 3/5 git add (todos los cambios) ===
git add -A

echo.
echo === 4/5 git commit ===
git commit -m "deploy %date% %time%"
if errorlevel 1 echo (Aviso) No habia cambios nuevos para commitear. Se intenta push igual.

echo.
echo === 5/5 git push ===
git push origin main
if errorlevel 1 (
  echo.
  echo ERROR: el push fallo. Revisa tu conexion o credenciales de git.
  pause
  exit /b 1
)

echo.
echo === LISTO: cambios pusheados. El deploy deberia dispararse solo. ===
pause
