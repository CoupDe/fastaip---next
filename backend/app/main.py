import asyncio

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from microservice.synchFormWithVisr import synch_route

from controllers.v1 import (
    building_route,
    structure_route,
    visr_route,
    formks_route,
)
from microservice.upload_visr import upload_route
from db.base import get_async_session
from schemas.userTest_schema import GetUser, User


app = FastAPI(title="Parser")


app.include_router(building_route.route, prefix="/api")
app.include_router(structure_route.route, prefix="/api")
app.include_router(upload_route.route, prefix="/api")
app.include_router(visr_route.router, prefix="/api")
app.include_router(formks_route.route, prefix="/api")
app.include_router(synch_route.router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/testuser", response_model=User)
async def test_user(user: GetUser):
    return {"id": 2, "name": "troy", "password": "testPassword"}


@app.get("/")
async def root(session: AsyncSession = Depends(get_async_session)):
    return {"message": "Hello World"}
