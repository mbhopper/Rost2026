import os
import json
import uuid
import re
from datetime import datetime
from fastapi import FastAPI, HTTPException, status, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app import models, database, auth, crud
from app.database import engine, Base

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="Digital Pass MVP",
    description="API для генерации цифрового пропуска сотрудника (QR-код) с MySQL",
    version="1.0.0"
)

# Настройка CORS (ограничиваем доверенные источники)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Защита от подделки хоста
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
)

@app.on_event("startup")
async def startup():
    await init_db()

# Валидация входных данных
def validate_username(username: str) -> bool:
    """Проверка username (только буквы, цифры, точка, подчеркивание)"""
    pattern = r'^[a-zA-Z0-9._]{3,50}$'
    return bool(re.match(pattern, username))

def validate_email(email: str) -> bool:
    """Проверка email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> tuple:
    """Проверка сложности пароля"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if len(password) > 128:
        return False, "Password must be less than 128 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    return True, ""

@app.post("/api/register", response_model=models.UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: models.UserRegister,
    request: Request,
    db: AsyncSession = Depends(database.get_db)
):
    # Валидация username
    if not validate_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be 3-50 characters and contain only letters, numbers, dots and underscores"
        )
    
    # Валидация email
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Валидация пароля
    is_valid, password_error = validate_password(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_error
        )
    
    # Обрезаем full_name
    if user_data.full_name and len(user_data.full_name) > 100:
        user_data.full_name = user_data.full_name[:100]
    
    try:
        created_user = await crud.create_user(
            db=db,
            username=user_data.username,
            password=user_data.password,
            email=user_data.email,
            full_name=user_data.full_name
        )
        return models.UserResponse(
            username=created_user.username,
            email=created_user.email,
            full_name=created_user.full_name
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.post("/api/auth/login", response_model=models.Token)
async def login(
    login_data: models.UserLogin,
    request: Request,
    db: AsyncSession = Depends(database.get_db)
):
    # Получаем IP адрес
    client_ip = request.client.host
    
    # Проверка попыток входа
    if not auth.check_login_attempts(client_ip, login_data.username):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Try again later."
        )
    
    user = await crud.authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        # Записываем неудачную попытку
        auth.record_login_attempt(client_ip, login_data.username, False)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Записываем успешный вход
    auth.record_login_attempt(client_ip, login_data.username, True)
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/pass/generate", response_model=models.PassResponse)
async def generate_pass(current_user = Depends(auth.get_current_user)):
    # Генерируем ограниченный по времени пропуск
    qr_payload = {
        "pass_id": str(uuid.uuid4()),
        "user_id": current_user.username,
        "full_name": current_user.full_name or current_user.username,
        "email": current_user.email,
        "timestamp": datetime.utcnow().isoformat(),
        "valid_for_minutes": 15,
        "issued_at": datetime.utcnow().isoformat()
    }
    
    qr_data = json.dumps(qr_payload)
    
    return {
        "qr_code_data": qr_data,
        "message": "Пропуск успешно сгенерирован. Действителен 15 минут.",
        "user_info": {
            "username": current_user.username,
            "full_name": current_user.full_name or "",
            "email": current_user.email
        }
    }

@app.get("/api/health")
async def health_check(db: AsyncSession = Depends(database.get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "message": "Digital Pass MVP is running",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Database connection failed",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Digital Pass MVP API with MySQL",
        "docs": "/docs",
        "endpoints": ["/api/register", "/api/auth/login", "/api/pass/generate"],
        "version": "1.0.0"
    }