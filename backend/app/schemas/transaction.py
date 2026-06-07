from pydantic import BaseModel
from datetime import date
from uuid import UUID

class TransactionCreate(BaseModel):
    title: str
    amount: float
    transaction_date: date | None = None
    payment_type: str = "cash"
    notes: str | None = None
    # category is intentionally omitted — AI fills it

class TransactionUpdate(BaseModel):
    title: str
    amount: float | None = None
    category: str | None = None
    notes: str | None = None

class TransactionResponse(BaseModel):
    id: UUID
    title: str
    amount: float 
    category: str | None
    merchant: str | None
    transaction_date: date
    payment_type: str
    ai_categorized: bool

    model_config = {"from_attributes": True}

