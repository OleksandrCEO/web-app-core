"""Re-export every SQLAlchemy model from this package.

Adding a new model? Two steps:
1. Create `app/models/<name>.py` with the `Mapped` class.
2. Re-export it here AND import it in `alembic/env.py` — otherwise
   `alembic revision --autogenerate` will not detect it.
"""

# Example (uncomment after creating app/models/user.py):
# from app.models.user import User

__all__: list[str] = [
    # "User",
]
