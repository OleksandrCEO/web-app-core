import base64
import hashlib
import hmac
import json
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from app.config import settings


def _b64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    padding: int = (4 - len(value) % 4) % 4
    return base64.urlsafe_b64decode(value + ("=" * padding))


def hash_password(password: str) -> str:
    salt: bytes = secrets.token_bytes(16)
    derived_key: bytes = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=2**14,
        r=8,
        p=1,
        dklen=32,
    )
    return f"scrypt${_b64url_encode(salt)}${_b64url_encode(derived_key)}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        algorithm, encoded_salt, encoded_hash = hashed_password.split("$", maxsplit=2)
    except ValueError:
        return False

    if algorithm != "scrypt":
        return False

    salt: bytes = _b64url_decode(encoded_salt)
    expected_hash: bytes = _b64url_decode(encoded_hash)
    actual_hash: bytes = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=2**14,
        r=8,
        p=1,
        dklen=32,
    )
    return hmac.compare_digest(expected_hash, actual_hash)


def create_token(payload: dict[str, Any], minutes: int) -> str:
    header: dict[str, str] = {"alg": "HS256", "typ": "JWT"}
    now: datetime = datetime.now(UTC)
    body: dict[str, Any] = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=minutes)).timestamp()),
    }

    header_encoded: str = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    body_encoded: str = _b64url_encode(json.dumps(body, separators=(",", ":")).encode("utf-8"))
    signing_input: bytes = f"{header_encoded}.{body_encoded}".encode("utf-8")
    signature: bytes = hmac.new(
        settings.jwt_secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()

    return f"{header_encoded}.{body_encoded}.{_b64url_encode(signature)}"


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        header_encoded, body_encoded, signature_encoded = token.split(".")
    except ValueError:
        return None

    signing_input: bytes = f"{header_encoded}.{body_encoded}".encode("utf-8")
    expected_signature: bytes = hmac.new(
        settings.jwt_secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    actual_signature: bytes = _b64url_decode(signature_encoded)

    if not hmac.compare_digest(expected_signature, actual_signature):
        return None

    try:
        body: dict[str, Any] = json.loads(_b64url_decode(body_encoded))
    except (ValueError, json.JSONDecodeError):
        return None

    if int(body.get("exp", 0)) < int(datetime.now(UTC).timestamp()):
        return None

    return body
