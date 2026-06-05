from fastapi import Depends, HTTPException, Request, status

from app.security import decode_token


async def get_current_active_user(request: Request) -> dict:
    """Resolve the current user from the `Authorization: Bearer <jwt>` header.

    Returns the decoded JWT payload. Replace the return type with your `User`
    model + a DB lookup once the users table exists.
    """
    auth_header: str | None = request.headers.get("authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    token: str = auth_header.split(" ", 1)[1]
    payload: dict | None = decode_token(token)
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    return payload


CurrentUser = Depends(get_current_active_user)
