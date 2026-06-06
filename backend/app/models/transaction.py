import uuid
from datetime import datetime, date, timezone
from sqlalchemy import String, Numeric, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    category: Mapped[str | None] = mapped_column(String(50))
    merchant: Mapped[str | None] = mapped_column(String(100))
    transcation_date: Mapped[date] = mapped_column(Date, default=date.today)
    payment_type: Mapped[str] = mapped_column(String(20), default="cash")
    notes: Mapped[str | None] = mapped_column(Text)
    ai_categorized: Mapped[bool] = mapped_column(Boolean, default=False)
    create_at: Mapped[datetime] = mapped_column(DateTime(timezone= True), default=datetime.now(timezone.utc))
    
    user: Mapped["User"] = relationship(back_populates="transactions")

