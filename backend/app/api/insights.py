from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.ai_insight import AIInsight
from app.schemas.insight import InsightResponse
from app.services.ai.insights import generate_insights

router = APIRouter(prefix="/insights", tags=["insights"])

@router.post("/generate", response_model=list[InsightResponse])
async def generate(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    insights = await generate_insights(current_user.id, db)
    if not insights:
        raise HTTPException(400, "Not enough transaction data to generate insights yet")
    return insights


@router.get("", response_model=list[InsightResponse])
async def list_insight(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
): 
    results = await db.scalars(
        select(AIInsight)
        .where(AIInsight.user_id == current_user.id)
        .order_by(AIInsight.create_at.desc())
        .limit(10)
    )
    return results.all()