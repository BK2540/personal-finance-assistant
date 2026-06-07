from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class InsightResponse(BaseModel):
    id: UUID
    content: str
    insight_type: str
    created_at: datetime

    model_config = {"from_attributes": True}