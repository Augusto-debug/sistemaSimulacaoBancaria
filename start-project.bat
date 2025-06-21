@echo off
echo Iniciando Sistema de Simulacao Bancaria com JWT...
echo.

echo Instalando dependencias do backend...
cd backend
call mvnw.cmd clean install -DskipTests
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do backend
    pause
    exit /b %errorlevel%
)

echo.
echo Executando migracao do banco de dados...
echo Por favor, execute o script migration.sql no seu banco MySQL antes de continuar
pause

echo.
echo Iniciando backend...
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo Aguardando backend inicializar...
timeout /t 10 /nobreak > nul

echo.
echo Instalando dependencias do frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias do frontend
    pause
    exit /b %errorlevel%
)

echo.
echo Iniciando frontend...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Sistema iniciado!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Para fazer login, use as credenciais:
echo Email: user1@temp.com (ou crie uma nova conta)
echo Senha: 123456
echo.
pause 