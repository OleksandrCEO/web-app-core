"""Singleton service instances.

Each entity's service is instantiated once here and imported elsewhere as

    from app.services import user_service

Why singletons: services are stateless wrappers around `Session` + model.
Re-using one instance per process avoids accidental per-request creation
and keeps tests easy to mock.
"""

# Example (uncomment after creating app/services/user.py and app/models/user.py):
# from app.models import User
# from app.services.user import UserService
#
# user_service: UserService = UserService(User)

__all__: list[str] = [
    # "user_service",
]
