from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from app.core.config import settings
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.ai_insight import AIInsight
import uuid, json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_insights(user_id: uuid.UUID, db: AsyncSession) -> list[AIInsight]:
    """
    1. Aggregate last 30 days of spending by category
    2. Check budget usage
    3. Send summary to OpenAI
    4. Store and return insight cards
    """

    # --- Step 1: Aggregate spending last 30 days ---
    since = datetime.now().date() - timedelta(days=30)

    spending_rows = (await db.execute(
        select(Transaction.category, func.sum(Transaction.amount), func.count())
        .where(
            Transaction.user_id == user_id,
            Transaction.transcation_date >= since,
        )
        .group_by(Transaction.category)
    )).all()

    if not spending_rows:
        return [] # no data yet
    
    spending_summary = [
        {
            "category": row[0] or "Other",
            "total": float(row[1]),
            "transactions": int(row[2]),
        }
        for row in spending_rows
    ]
    total_spent = sum(s["total"] for s in spending_summary)

    # --- Step 2: Check budget status ---
    month_year = datetime.now().strftime("%Y-%m")
    budgets = (await db.scalars(
        select(Budget).where(
            Budget.user_id == user_id,
            Budget.month_year == month_year,
        )
    )).all()

    budget_status = []
    for b in budgets:
        spent = next(
            (s["total"] for s in spending_summary if s["category"] == b.category), 0
        )
        pct = round((spent / float(b.monthly_limit)) * 100, 1)
        budget_status.append({
            "category": b.category,
            "limit": float(b.monthly_limit),
            "spent": spent,
            "percentage": pct,
            "over_budget": pct > 100,
        })

    # --- Step 3: Build a compact prompt (keeps token cost low) ---
    prompt_data = {
        "period": "last 30 days",
        "total_spent": total_spent,
        "by_category": spending_summary,
        "budget_status": budget_status,
    }
        
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=400,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a friendly personal finance advisor. "
                    "Generate exactly 3 short, supportive spending insights based on the data. "
                    "Each insight must be 1-2 sentences, calm in tone, and actionable. "
                    "Reply ONLY with JSON: "
                    '{"insights": [{"type": "weekly_summary|trend|budget_alert", "content": "..."}]}'
                ),
            },  
            {
                "role": "user",
                "content": f"My spending data: {json.dumps(prompt_data)}",
            }
        ]
    )

    # --- Step 4: Parse and store insight cards ---
    raw = json.loads(response.choices[0].message.content)
    new_insights = []

    for item in raw.get("insights", []):
        insight = AIInsight(
            user_id = user_id,
            content = item["content"],
            insight_type = item.get("type", "weekly_summary"),
        )
        db.add(insight)
        new_insights.append(insight)

    await db.flush()
    return new_insights
