import os
import secrets
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, database

# Читаем секретный ключ из переменных окружения
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    # Генерируем случайный ключ, если не задан (только для разработки)
    SECRET_KEY = secrets.token_urlsafe(32)
    print("WARNING: Using generated SECRET_KEY. Set it in .env for production!")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Хранилище для отслеживания попыток входа (в production использовать Redis)
login_attempts = {}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Добавляем jti (уникальный ID токена) для возможности отзыва
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": secrets.token_urlsafe(16)
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Проверка и декодирование токена"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(database.get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if not payload:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = await crud.get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    
    return user

def check_login_attempts(ip: str, username: str) -> bool:
    """Проверка количества попыток входа"""
    key = f"{ip}:{username}"
    now = datetime.utcnow()
    
    # Очистка старых записей
    for k in list(login_attempts.keys()):
        if login_attempts[k]["timestamp"] < now - timedelta(minutes=15):
            del login_attempts[k]
    
    if key in login_attempts:
        attempts = login_attempts[key]["count"]
        if attempts >= 5:  # Максимум 5 попыток за 15 минут
            return False
    
    return True

def record_login_attempt(ip: str, username: str, success: bool):
    """Запись попытки входа"""
    key = f"{ip}:{username}"
    
    if not success:
        if key in login_attempts:
            login_attempts[key]["count"] += 1
            login_attempts[key]["timestamp"] = datetime.utcnow()
        else:
            login_attempts[key] = {
                "count": 1,
                "timestamp": datetime.utcnow()
            }
    else:
        # Удаляем записи при успешном входе
        if key in login_attempts:
            del login_attempts[key]