from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import dev
from app.payments.router import router as payments_router

app = FastAPI(title="Khonย้าย API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments_router)
app.include_router(dev.router)
