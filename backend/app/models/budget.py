import uuid
from datetime import datetime, date, timezone
from sqlalchemy import String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base

class Budget(Base):
    __tablename__ = "budget"

    id: Mapped[uuid.UUID] = mapped_column(primary_key= True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"), index= True)
    category: Mapped[str | None] = mapped_column(String(50))
    monthly_limit: Mapped[float] = mapped_column(Numeric(12, 2), nullable= False)
    month_year: Mapped[str] = mapped_column(String(7), comment="Format: yyyy-mm")
    create_at: Mapped[datetime] = mapped_column(DateTime(timezone = True), default=datetime.now(timezone.utc))

