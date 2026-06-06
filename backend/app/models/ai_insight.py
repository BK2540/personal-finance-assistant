import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class AiInsight(Base):
    __tablename__="aiInsight"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"), index=True)
    content: Mapped[str | None] = mapped_column(Text)
    insight_type: Mapped[str] = mapped_column(String(30), default="weekly_summary")
    create_at: Mapped[datetime] = mapped_column(DateTime(timezone= True), default=datetime.now(timezone.utc))

