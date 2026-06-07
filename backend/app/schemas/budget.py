from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float = Field(gt=0)
    month_year: str

class BudgetUpdate(BaseModel):
    monthly_limit: float = Field(gt=0)

class BudgetResponse(BaseModel): 
    id: UUID
    category: str
    monthly_limit: float
    month_year: str
    current_spending: float
    percentage_used:float
    create_at: datetime

    model_config = {"from_attributes": True}