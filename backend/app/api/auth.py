from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/register", response_model=TokenResponse, status_code=201)
# async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
#     existing = await db.scalar(select(User).where(User.email == body.email))
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     user = User(
#         email=body.email,
#         password_hash=hash_password(body.password),
#         full_name=body.full_name,
#     )
#     db.add(User)
#     await db.flush() # get the user.id before commit

#     token = create_access_token(str(user.id))
#     return TokenResponse(access_token=token)
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Add this check
    if len(body.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 characters or fewer")

    existing = await db.scalar(select(User).where(User.email == body.email))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        full_name=body.full_name,
    )
    db.add(user)
    await db.flush()

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == body.email))
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)

