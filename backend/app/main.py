import asyncio
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from db.base import create_db_and_tables

from controllers.v1 import (
    building_route,
    structure_route,
    upload_route,
    visr_route,
    formks_route,
)
from db.base import get_async_session
from schemas.userTest_schema import GetUser, User

app = FastAPI(title="Parser")
# asyncio.run(init_models())

app.include_router(building_route.route, prefix="/api")
app.include_router(structure_route.route, prefix="/api")
app.include_router(upload_route.route, prefix="/api")
app.include_router(visr_route.route, prefix="/api")
app.include_router(formks_route.route, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.on_event("startup")
# async def on_startup():
#     # Not needed if you setup a migration system like Alembic
#     await create_db_and_tables()
@app.post("/testuser", response_model=User)
async def test_user(user: GetUser):
    return {"id": 2, "name": "troy", "password": "testPassword"}


@app.get("/")
async def root(session: AsyncSession = Depends(get_async_session)):
    return {"message": "Hello World"}
