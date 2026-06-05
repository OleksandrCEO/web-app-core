from collections.abc import Mapping
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

ModelT = TypeVar("ModelT")


class CRUDService(Generic[ModelT]):
    """Generic create/read/update/delete service.

    Subclass and bind the model:

        class UserService(CRUDService[User]):
            pass

        user_service = UserService(User)

    Services only `flush()`; routers call `await db.commit()` after each
    mutation to keep transactional boundaries explicit.
    """

    def __init__(self, model: type[ModelT]) -> None:
        self._model: type[ModelT] = model

    @property
    def model(self) -> type[ModelT]:
        return self._model

    async def create(self, session: AsyncSession, data: Mapping[str, Any]) -> ModelT:
        db_obj: ModelT = self._model(**dict(data))
        session.add(db_obj)
        await session.flush()
        await session.refresh(db_obj)
        return db_obj

    async def get_by_id(self, session: AsyncSession, obj_id: Any) -> ModelT | None:
        return await session.get(self._model, obj_id)

    async def list(
        self, session: AsyncSession, limit: int = 100, offset: int = 0
    ) -> list[ModelT]:
        stmt = select(self._model).offset(offset).limit(limit)
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def update(
        self,
        session: AsyncSession,
        db_obj: ModelT,
        data: Mapping[str, Any],
    ) -> ModelT:
        for key, value in data.items():
            setattr(db_obj, key, value)
        session.add(db_obj)
        await session.flush()
        await session.refresh(db_obj)
        return db_obj

    async def delete(self, session: AsyncSession, db_obj: ModelT) -> None:
        await session.delete(db_obj)
        await session.flush()
