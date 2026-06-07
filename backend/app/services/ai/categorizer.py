from openai import AsyncOpenAI
from app.core.config import settings
import json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

VALID_CATEGORIES = [
     "Food", "Transportation", "Shopping", "Bills",
    "Entertainment", "Subscription", "Education", "Other"
]

async def categorize_expense(title: str) -> tuple[str, str | None]:
    """Return (category, merchant). Falls back to ('Other', None) onany error."""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=80,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a finance categorizer. Reply ONLY with JSON: "
                        f'{{ "category": "...", "merchant": "..."}}. '
                        f"Category must be one of: {', '.join(VALID_CATEGORIES)}."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Categorize this expense: '{title}'"
                },
            ],
        )

        data = json.loads(response.choices[0].message.content)
        category = data.get("category", "Other")
        if category not in VALID_CATEGORIES:
            category = "Other"
        return category, data.get("merchant")
    
    except Exception as e:
       print(f"[AI] categorization failed: {e}")
       return "Other", None 