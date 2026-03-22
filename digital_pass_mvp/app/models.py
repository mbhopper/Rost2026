from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

class UserRegister(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: Optional[str] = None
    
    @field_validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9._]{3,50}$', v):
            raise ValueError('Username must be 3-50 characters and contain only letters, numbers, dots and underscores')
        return v
    
    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if len(v) > 128:
            raise ValueError('Password must be less than 128 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('full_name')
    def validate_full_name(cls, v):
        if v and len(v) > 100:
            return v[:100]
        return v

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PassResponse(BaseModel):
    qr_code_data: str
    message: str
    user_info: dict