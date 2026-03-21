Мануал по деплою проекта в Docker, Полный тест всех эндпоинтов, Очистка и перезапуск проекта.

1) Запуск через терминал: docker-compose up --build

2) Проверка запустились ли контейнеры: docker ps
Должны увидеть:

CONTAINER ID   IMAGE                  STATUS         PORTS
xxx           digital_pass_mysql     Up            0.0.0.0:3306->3306/tcp
xxx           digital_pass_app       Up            0.0.0.0:8000->8000/tcp
xxx           digital_pass_phpmyadmin Up           0.0.0.0:8080->80/tcp

3) Проверьте Swagger UI:

Лучший способ через powershell потому что сам Swagger UI кривой =(

Полный тест всех эндпоинтов:

Write-Host "========================================" -ForegroundColor Green
Write-Host "ПОЛНОЕ ТЕСТИРОВАНИЕ API" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# 1. Healthcheck
Write-Host "1. Healthcheck:" -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:8000/api/health"
$health | ConvertTo-Json
Write-Host ""

# 2. Регистрация (если пользователь не существует)
Write-Host "2. Регистрация:" -ForegroundColor Yellow
$registerBody = @{
    username = "testuser2"
    password = "TestPass456"
    email = "test2@example.com"
    full_name = "Test User 2"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:8000/api/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    $register | ConvertTo-Json
} catch {
    Write-Host "Пользователь возможно уже существует: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# 3. Логин
Write-Host "3. Логин:" -ForegroundColor Yellow
$loginBody = '{"username":"testuser2","password":"TestPass456"}'
$login = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

$token = $login.access_token
Write-Host "Токен получен: $($token.Substring(0, 50))..." -ForegroundColor Green
Write-Host ""

# 4. Генерация пропуска
Write-Host "4. Генерация пропуска:" -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $token" }
$pass = Invoke-RestMethod -Uri "http://localhost:8000/api/pass/generate" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Пропуск сгенерирован!" -ForegroundColor Green
Write-Host "Сообщение: $($pass.message)" -ForegroundColor Cyan
Write-Host "Пользователь: $($pass.user_info.full_name)" -ForegroundColor Cyan
Write-Host ""

# 5. Расшифровка QR данных
Write-Host "5. QR данные (расшифровка):" -ForegroundColor Yellow
$qrData = $pass.qr_code_data | ConvertFrom-Json
$qrData | ConvertTo-Json -Depth 10

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Все тесты пройдены успешно!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

После запуска в powershell требуется открыть терминал где запущен Docker и проверить логи:
docker-compose logs

Получившийся результат закинуть в Deepseek с запросом проверка логов API результат будет примерно такой в лучшем случае:
Ваши логи показывают, что API полностью функционирует:

Операция		Статус			Что произошло
Регистрация		201 Created	✅ Новый пользователь testuser2 создан
Логин			200 OK		✅ Токен успешно получен
Генерация пропуска	200 OK		✅ QR-код сгенерирован

4) Очистка и перезапуск докера:

# Остановить и удалить все контейнеры, сети и volumes проекта
docker-compose down -v

# Удалить все остановленные контейнеры
docker container prune -f

# Проверить, что контейнеров нет
docker ps -a

# Запустить с пересборкой
docker-compose up --build
