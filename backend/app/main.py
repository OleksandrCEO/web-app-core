import logging
import sys

from fastapi import FastAPI

from app.routers import health

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)

app = FastAPI(title="Backend")

app.include_router(health.router)
