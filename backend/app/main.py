from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import dev
from app.auth import router as auth_router
from app.bookings.router import router as bookings_router
from app.cancellation.router import router as cancellation_router
from app.payments.router import router as payments_router
from app.register.router import router as register_router
from app.routes import tracking

app = FastAPI(title="Khonย้าย API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments_router)
app.include_router(dev.router)
app.include_router(auth_router)
app.include_router(register_router)
app.include_router(bookings_router)
app.include_router(cancellation_router)
app.include_router(tracking.router)
