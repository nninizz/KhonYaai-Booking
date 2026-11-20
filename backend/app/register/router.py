from collections.abc import Callable, Coroutine
from typing import Any

from fastapi import APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
from starlette.requests import Request
from starlette.responses import Response

from app.register.schemas import REQUIRED_MESSAGE, RegisterRequest, UserOut
from app.register.service import DuplicateUserError, create_user


class RegisterRoute(APIRoute):
    # รองรับ REQ-FN-102 และ REQ-PRV-101 (AC-01-09, AC-01-10)
    def get_route_handler(
        self,
    ) -> Callable[[Request], Coroutine[Any, Any, Response]]:
        original_handler = super().get_route_handler()

        async def handle_request_validation(request: Request) -> Response:
            try:
                return await original_handler(request)
            except RequestValidationError as error:
                detail = []
                for item in error.errors():
                    message = item["msg"]
                    if item["type"] == "missing":
                        message = REQUIRED_MESSAGE
                    elif message.startswith("Value error, "):
                        message = message[len("Value error, "):]
                    detail.append({"loc": item["loc"], "msg": message})
                return JSONResponse(status_code=422, content={"detail": detail})

        return handle_request_validation


# รองรับ REQ-FN-101
router = APIRouter(
    prefix="/api/auth",
    tags=["register"],
    route_class=RegisterRoute,
)


@router.post("/register", response_model=UserOut, status_code=201)
def register_user(request: RegisterRequest) -> UserOut | JSONResponse:
    # รองรับ REQ-FN-101, REQ-FN-103, REQ-SEC-101 และ REQ-PRV-101
    try:
        return UserOut.model_validate(create_user(request.model_dump()))
    except DuplicateUserError as error:
        return JSONResponse(
            status_code=error.status_code,
            content={"detail": error.detail, "field": error.field},
        )
