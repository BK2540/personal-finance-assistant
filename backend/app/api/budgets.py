from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.services.finance.budget_service import get_budgets_with_spending

router = APIRouter(prefix="/budgets", tags=["budgets"])

def current_month() -> str:
    return datetime.now().strftime("%Y-%m")

@router.post("", response_model=BudgetResponse, status_code=201)
async def create_budget(
    body: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    # Prevent duplicate category for same month
    existing = await db.scalar(
        select(Budget).where(
            Budget.user_id == current_user.id,
            Budget.category == body.category,
            Budget.month_year == body.month_year,
        )
    )
    if existing: 
        raise HTTPException(400, f"Budget for {body.category} in {body.month_year} already exists")
    
    budget = Budget(
        user_id = current_user.id,
        category = body.category,
        monthly_limit = body.monthly_limit,
        month_year = body.month_year,
    )

    db.add(budget)
    await db.flush()

    # return with spending calculated
    budgets = await get_budgets_with_spending(current_user.id, body.month_year, db)
    created = next(b for b in budgets if b["id"] == budget.id)
    return created

@router.get("", response_model=list[BudgetResponse])
async def list_budgets(
    month_year: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    month = month_year or current_month()
    return await get_budgets_with_spending(current_user.id, month, db)


@router.patch("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: str,
    body: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    import uuid
    budget = await db.get(Budget, uuid.UUID(budget_id))
    if not budget or budget.user_id != current_user.id:
        raise HTTPException(404, "Budget not found")
    
    budget.monthly_limit = body.monthly_limit
    await db.flush()

    budgets = await get_budgets_with_spending(current_user.id, budget.month_year, db)
    return next(b for b in budgets if b["id"] == budget.id)

@router.delete("/{budget_id}", status_code=204)
async def delete_budget(
    budget_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    import uuid
    budget = await db.get(Budget, uuid.UUID(budget_id))
    if not budget or budget.user_id != current_user.id:
        raise HTTPException(404, "Budget not found")
    await db.delete(budget)