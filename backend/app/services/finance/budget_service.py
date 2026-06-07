from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.budget import Budget
from app.models.transaction import Transaction
import uuid

async def get_budgets_with_spending(
        user_id: uuid.UUID,
        month_year: str,
        db: AsyncSession
) -> list[dict]:
    """Fetch budgets and calculate current spending for each category."""

    # Get All budgets for this month
    budgets = (await db.execute(
        select(Budget).where(
            Budget.user_id == user_id,
            Budget.month_year == month_year,
        )
    )).scalars().all()

    # Get spending per category for this month in one query
    year, month = month_year.split("-")
    spending_rows = (await db.execute(
        select(Transaction.category, func.sum(Transaction.amount))
        .where(
            Transaction.user_id == user_id,
            func.extract("year", Transaction.transcation_date) == int(year),
            func.extract("month", Transaction.transcation_date) == int(month)
        )
        .group_by(Transaction.category)
    )).all()

    # Build a lookup dict  {category: total_spent}
    spending_map = {row[0]: float(row[1]) for row in spending_rows}

    result = []
    for budget in budgets:
        spent = spending_map.get(budget.category, 0.0)
        limit = float(budget.monthly_limit)
        result.append({
            "id": budget.id,
            "category": budget.category,
            "monthly_limit": limit,
            "month_year": budget.month_year,
            "current_spending": spent,
            "percentage_used": round((spent / limit) * 100, 1) if limit > 0 else 0,
            "created_at": budget.created_at
        })

    return result
