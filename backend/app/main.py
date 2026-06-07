from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, transactions, budgets, insights

app = FastAPI(
    title="mini API",
    description="AI-powered personal finance assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(insights.router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "mini Finance API"}