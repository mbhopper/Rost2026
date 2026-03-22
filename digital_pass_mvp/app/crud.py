from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from app import schemas

# Используем bcrypt с обрезкой пароля (безопасно)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user_by_username(db: AsyncSession, username: str):
    """Получить пользователя по username (безопасно)"""
    result = await db.execute(
        select(schemas.User).where(schemas.User.username == username)
    )
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    """Получить пользователя по email (безопасно)"""
    result = await db.execute(
        select(schemas.User).where(schemas.User.email == email)
    )
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, username: str, password: str, email: str, full_name: str = None):
    """Создать нового пользователя"""
    existing_user = await get_user_by_username(db, username)
    if existing_user:
        raise ValueError("Username already exists")
    
    existing_email = await get_user_by_email(db, email)
    if existing_email:
        raise ValueError("Email already registered")
    
    # Обрезаем пароль до 72 байт (ограничение bcrypt)
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password = password_bytes[:72].decode('utf-8', errors='ignore')
    
    hashed_password = pwd_context.hash(password)
    
    db_user = schemas.User(
        username=username,
        email=email,
        full_name=full_name[:100] if full_name else None,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

async def authenticate_user(db: AsyncSession, username: str, password: str):
    """Аутентификация пользователя"""
    user = await get_user_by_username(db, username)
    if not user:
        return None
    
    # Безопасная проверка пароля
    if not pwd_context.verify(password, user.hashed_password):
        return None
    
    return user