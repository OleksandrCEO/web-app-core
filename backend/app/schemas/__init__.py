"""Re-export every Pydantic schema from this package.

Convention per entity:
- `*Create` — input for POST. No id, no timestamps.
- `*Read` — output. `model_config = ConfigDict(from_attributes=True)`.
- `*Update` — input for PATCH. All fields Optional with default None.
"""

__all__: list[str] = []
