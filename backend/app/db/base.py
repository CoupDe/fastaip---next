import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import (AsyncSession, async_sessionmaker,
                                    create_async_engine)
from .models.modelBase import ModelBase


load_dotenv()
# metadata = MetaData()
print(ModelBase.metadata.schema)
DB_URL = f"postgresql+asyncpg://{os.environ.get('DB_USERNAME')}:{os.environ.get('DB_PASSWORD')}@{os.environ.get('DB_HOST')}:{os.environ.get('DB_PORT')}/{os.environ.get('DB_NAME')}"

# Создание асинхронного движка | echo-выводит sql запрос в терминал
async_engine = create_async_engine(
    DB_URL, echo=True)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def create_db_and_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(ModelBase.metadata.create_all)
