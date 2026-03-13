"""
security.py
===========
Production-grade authentication and token management for Codebrix AI.

Features over the original
---------------------------
* Refresh token support alongside access tokens.
* Token type enforcement — access tokens cannot be used as refresh tokens and vice versa.
* Typed dataclasses for all token payloads and decoded claims.
* Explicit token verification with rich, typed exceptions (maps to HTTP 401/403).
* `datetime.now(timezone.utc)` replaces deprecated `datetime.utcnow()`.
* Password strength validation before hashing.
* Timing-safe password verification with automatic rehash detection.
* Token blacklisting hook (ready for Redis integration).
* Full type hints and docstrings throughout.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any

from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext

from core.config import settings

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",          # auto-rehash old bcrypt cost factors
    bcrypt__rounds=12,          # explicit work factor (OWASP minimum)
)

# ---------------------------------------------------------------------------
# Token types
# ---------------------------------------------------------------------------

class TokenType(str, Enum):
    ACCESS  = "access"
    REFRESH = "refresh"


# ---------------------------------------------------------------------------
# Typed token payload
# ---------------------------------------------------------------------------

@dataclass
class TokenPayload:
    """Decoded, validated JWT claims."""

    sub:        str                    # subject (user id / email)
    token_type: TokenType
    exp:        datetime
    iat:        datetime
    jti:        str | None = None      # JWT ID — used for blacklisting
    scopes:     list[str] = field(default_factory=list)
    extra:      dict[str, Any] = field(default_factory=dict)


@dataclass
class TokenPair:
    """Access + refresh token issued together on login."""

    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    expires_in:    int = 0             # access token TTL in seconds


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class SecurityError(Exception):
    """Base class for all security-related errors."""


class TokenExpiredError(SecurityError):
    """Raised when a JWT has passed its expiry time."""


class TokenInvalidError(SecurityError):
    """Raised when a JWT is malformed, tampered-with, or has wrong type."""


class TokenBlacklistedError(SecurityError):
    """Raised when a JWT has been explicitly revoked."""


class WeakPasswordError(SecurityError):
    """Raised when a plaintext password does not meet strength requirements."""


# ---------------------------------------------------------------------------
# Password utilities
# ---------------------------------------------------------------------------

_PASSWORD_MIN_LENGTH = 8
_PASSWORD_PATTERN = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$"
)


def validate_password_strength(password: str) -> None:
    """
    Raise :class:`WeakPasswordError` if *password* does not meet the policy:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < _PASSWORD_MIN_LENGTH:
        raise WeakPasswordError(
            f"Password must be at least {_PASSWORD_MIN_LENGTH} characters long."
        )
    if not _PASSWORD_PATTERN.match(password):
        raise WeakPasswordError(
            "Password must contain uppercase, lowercase, a digit, and a special character."
        )


def hash_password(password: str, *, validate_strength: bool = True) -> str:
    """
    Hash *password* using bcrypt.

    Parameters
    ----------
    password         : plaintext password string
    validate_strength: if True (default) enforce the password policy before hashing

    Raises
    ------
    WeakPasswordError  if strength validation fails
    """
    if validate_strength:
        validate_password_strength(password)
    hashed = pwd_context.hash(password)
    log.debug("Password hashed successfully.")
    return hashed


def verify_password(plain_password: str, hashed_password: str) -> tuple[bool, bool]:
    """
    Verify *plain_password* against *hashed_password*.

    Returns
    -------
    (is_valid, needs_rehash)
        is_valid     : True if the password matches
        needs_rehash : True if the hash should be updated (e.g. cost factor changed)

    The caller should persist the new hash if ``needs_rehash`` is True.
    """
    is_valid = pwd_context.verify(plain_password, hashed_password)
    needs_rehash = pwd_context.needs_update(hashed_password) if is_valid else False
    return is_valid, needs_rehash


# ---------------------------------------------------------------------------
# Token blacklist hook
# ---------------------------------------------------------------------------

def _is_token_blacklisted(jti: str | None) -> bool:
    """
    Return True if the JWT ID has been revoked.

    Replace this stub with a Redis / DB lookup:

        return redis_client.exists(f"blacklist:{jti}") > 0
    """
    return False  # stub — not blacklisted


def revoke_token(jti: str) -> None:
    """
    Add a JWT ID to the blacklist.

    Replace this stub with:

        redis_client.setex(f"blacklist:{jti}", ttl_seconds, "1")
    """
    log.info("Token revoked — jti=%s (stub; wire up Redis for production)", jti)


# ---------------------------------------------------------------------------
# Token creation
# ---------------------------------------------------------------------------

def _build_token(
    subject: str,
    token_type: TokenType,
    expires_delta: timedelta,
    *,
    scopes: list[str] | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    import uuid

    now    = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload: dict[str, Any] = {
        "sub":        subject,
        "type":       token_type.value,
        "iat":        now,
        "exp":        expire,
        "jti":        str(uuid.uuid4()),
        "scopes":     scopes or [],
    }
    if extra_claims:
        # Never allow extra_claims to overwrite reserved keys
        reserved = {"sub", "type", "iat", "exp", "jti", "scopes"}
        safe_extras = {k: v for k, v in extra_claims.items() if k not in reserved}
        payload.update(safe_extras)

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    log.debug("Token created — type=%s sub=%s exp=%s", token_type.value, subject, expire)
    return token


def create_access_token(
    subject: str,
    *,
    scopes: list[str] | None = None,
    extra_claims: dict[str, Any] | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Issue a signed JWT access token.

    Parameters
    ----------
    subject       : unique identifier for the token owner (user id or email)
    scopes        : optional list of permission scopes (e.g. ["read", "write"])
    extra_claims  : optional additional claims merged into the payload
    expires_delta : override the default TTL from settings
    """
    delta = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return _build_token(subject, TokenType.ACCESS, delta, scopes=scopes, extra_claims=extra_claims)


def create_refresh_token(
    subject: str,
    *,
    extra_claims: dict[str, Any] | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Issue a signed JWT refresh token (longer-lived, no scopes).

    Refresh tokens should be stored server-side and rotated on each use.
    """
    delta = expires_delta or timedelta(days=getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7))
    return _build_token(subject, TokenType.REFRESH, delta, extra_claims=extra_claims)


def create_token_pair(
    subject: str,
    *,
    scopes: list[str] | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> TokenPair:
    """
    Issue a matched access + refresh token pair in a single call.
    Use this on login / token refresh endpoints.
    """
    access_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access  = create_access_token(subject, scopes=scopes, extra_claims=extra_claims)
    refresh = create_refresh_token(subject, extra_claims=extra_claims)
    return TokenPair(
        access_token=access,
        refresh_token=refresh,
        expires_in=int(access_delta.total_seconds()),
    )


# ---------------------------------------------------------------------------
# Token verification
# ---------------------------------------------------------------------------

def decode_token(token: str, *, expected_type: TokenType = TokenType.ACCESS) -> TokenPayload:
    """
    Decode and fully validate a JWT.

    Checks performed
    ----------------
    1. Signature validity
    2. Expiry (`exp` claim)
    3. Token type (`type` claim matches *expected_type*)
    4. Blacklist lookup via `jti`

    Parameters
    ----------
    token         : raw JWT string (typically from Authorization header)
    expected_type : which token type is acceptable (default: ACCESS)

    Returns
    -------
    TokenPayload  with all decoded claims

    Raises
    ------
    TokenExpiredError     if the token has expired
    TokenInvalidError     if the token is malformed or has wrong type
    TokenBlacklistedError if the token's jti has been revoked
    """
    try:
        raw: dict[str, Any] = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except ExpiredSignatureError as exc:
        log.warning("Expired token presented.")
        raise TokenExpiredError("Token has expired. Please log in again.") from exc
    except JWTError as exc:
        log.warning("Invalid token: %s", exc)
        raise TokenInvalidError(f"Token is invalid: {exc}") from exc

    # Type check
    token_type_raw = raw.get("type")
    try:
        token_type = TokenType(token_type_raw)
    except ValueError:
        raise TokenInvalidError(f"Unknown token type: {token_type_raw!r}")

    if token_type != expected_type:
        raise TokenInvalidError(
            f"Expected {expected_type.value!r} token but received {token_type.value!r} token."
        )

    # Blacklist check
    jti = raw.get("jti")
    if _is_token_blacklisted(jti):
        log.warning("Blacklisted token presented — jti=%s", jti)
        raise TokenBlacklistedError("Token has been revoked.")

    return TokenPayload(
        sub=raw["sub"],
        token_type=token_type,
        exp=datetime.fromtimestamp(raw["exp"], tz=timezone.utc),
        iat=datetime.fromtimestamp(raw["iat"], tz=timezone.utc),
        jti=jti,
        scopes=raw.get("scopes", []),
        extra={
            k: v for k, v in raw.items()
            if k not in {"sub", "type", "exp", "iat", "jti", "scopes"}
        },
    )


def decode_refresh_token(token: str) -> TokenPayload:
    """Convenience wrapper — decodes and validates a refresh token."""
    return decode_token(token, expected_type=TokenType.REFRESH)