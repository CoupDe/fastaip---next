import asyncio
from schemas.userTest_schema import GetUser, User
from fastapi.middleware.cors import CORSMiddleware
from controllers.v1 import building_route, structure_route
from db.base import async_engine, create_db_and_tables, get_async_session
from fastapi import Depends, FastAPI
from schemas.building_schema import *
from sqlalchemy.ext.asyncio import AsyncSession
from config import origins

app = FastAPI(title='Parser')
# asyncio.run(init_models())

app.include_router(building_route.route, prefix='/api')
app.include_router(structure_route.route, prefix='/api')
app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],)


# @app.on_event("startup")
# async def on_startup():
#     # Not needed if you setup a migration system like Alembic
#     await create_db_and_tables()
@app.post('/testuser', response_model=User)
async def test_user(user: GetUser):
    return {'id': 2,
            'name': 'troy',
            'password': 'testPassword'}


@app.get("/")
async def root(session: AsyncSession = Depends(get_async_session)):

    return {"message": "Hello World"}


@app.post("/building", response_model=Building)
async def root(building: CreateBuilding, createsessioFn: AsyncSession = Depends(get_async_session)):

    return {"message": "Hello World"}
