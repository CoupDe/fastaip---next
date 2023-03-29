import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from db.models.structure_model import Structure
from schemas import structure_schema
from sqlalchemy import insert, select
from sqlalchemy.orm import selectinload


async def read_all_structures(session: AsyncSession):
    """_summary_
    greenlet error
    Необходимо добавлять .options(selectinload(Structure.buildings) ссылаясь на зависимость
    в случае присутсвия связей моделей
    """
    stmt = select(Structure).where(Structure.id > 1).options(
        selectinload(Structure.buildings))
    ss = (await session.execute(stmt))
    
    print('ss', ss.scalars().all())
    return (await session.scalars(stmt)).fetchall()


async def create_structure(structure: structure_schema.CreateStructure, session: AsyncSession) -> None:
    await session.execute(insert(Structure).values(**structure.dict()))
    await session.commit()
    # new_structure = Structure(**structure.dict())
    # session.add(new_structure)
    # await session.commit()
    return
