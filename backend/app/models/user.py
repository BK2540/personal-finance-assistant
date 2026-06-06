import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(100))
    currency: Mapped[str] = mapped_column(String(5), default="THB")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="user")
    budgets: Mapped[list["Budget"]] = relationship(back_populates="user")
    insights: Mapped[list["AIInsight"]] = relationship(back_populates="user")