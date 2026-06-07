from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.services.ai.categorizer import categorize_expense

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    body: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    # Call AI categorizer (fall back gracefully if it fails)
    category, merchant = await categorize_expense(body.title)

    tx = Transaction(
        user_id = current_user.id,
        title = body.title,
        amount = body.amount,
        category = category,
        merchant=merchant,
        transaction_date = body.transaction_date,
        payment_type = body.payment_type,
        notes= body.notes,
        ai_categorized=(category != "Other"),
    )
    db.add(tx)
    return tx

@router.get("", response_model=list[TransactionResponse])
async def list_transactions(
    category: str | None = None,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db),
): 
    query = select(Transaction).where(Transaction.user_id == current_user.id)
    if category:
        query = query.where(Transaction.category == category)
    query = query.order_by(Transaction.transcation_date.desc())
    result = await db.scalar(query)
    return result.all()

@router.patch("/{tx_id}", response_model=TransactionResponse, status_code=200)
async def update_transaction(
    tx_id: str,
    body: TransactionUpdate,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db),
): 
    result = await db.execute(select(Transaction).where(Transaction.id == tx_id))
    tx = result.scalar_one_or_none()

    if not tx or tx.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if body.title is not None:
        tx.title = body.title
    if body.amount is not None:
        tx.amount = body.amount
    if body.category is not None:
        tx.category = body.category
    if body.notes is not None:
        tx.notes = body.notes
    
    await db.commit()
    await db.refresh(tx)
    return tx

@router.delete("/{tx_id}", status_code=204)
async def delete_transaction(
    tx_id: str,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db),
):
    tx = await db.get(Transaction, tx_id)
    if not tx or tx.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await db.delete(tx)
    
