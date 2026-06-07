from __future__ import annotations
import uuid
from datetime import datetime, date, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

if TYPE_CHECKING:
    from app.models.user import User

class Budget(Base):
    __tablename__ = "budgets"

    id: Mapped[uuid.UUID] = mapped_column(primary_key= True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index= True)
    category: Mapped[str | None] = mapped_column(String(50), nullable= False)
    monthly_limit: Mapped[float] = mapped_column(Numeric(12, 2), nullable= False)
    month_year: Mapped[str] = mapped_column(String(7), comment="Format: yyyy-mm", nullable= False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="budgets")