import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from db.models.structure_model import Structure
from schemas import structure_schema
from sqlalchemy import asc, delete, desc, insert, or_, select
from sqlalchemy.orm import selectinload


async def read_all_structures(session: AsyncSession) -> list[Structure]:
    """_summary_
    order_by->asc;
    error: greenlet error
    Необходимо добавлять .options(selectinload(Structure.buildings)  в синхронной среде он может
    лениво загружать отношения но в асинхронной среде это невозможно с помощью selectinload он
    явно предварительно загружает отношения.
    """
    stmt = select(Structure).where(Structure.id > 0).options(
        selectinload(Structure.buildings)).order_by(asc(Structure.name))
    return (await session.scalars(stmt)).all()

"""session.get(Structure,id)->чем отличается от нижеуказанного """


async def read_structure(id: int, session: AsyncSession) -> Structure:
    stmt = select(Structure).where(Structure.id == id).options(
        selectinload(Structure.buildings))
    return (await session.scalar(stmt))


async def get_structure_by_code_name(name: str, code_structure: str, session: AsyncSession) -> None:
    structure = await session.scalar(select(Structure).where(or_(Structure.name == name, Structure.code_structure == code_structure)))
    return structure


async def create_structure(structure: structure_schema.CreateStructure, session: AsyncSession) -> Structure | None:
    structure = await session.scalar(insert(Structure).values(**structure.dict()
                                                              ).returning(Structure))
    await session.commit()
    return structure

"""Проверить как ведет себя таблица ребенка"""


async def delete_structure(id: int, session: AsyncSession) -> str | None:
    stmt = delete(Structure).where(
        Structure.id == id).returning(Structure.name)
    result = (await session.scalar(stmt))
    await session.commit()
    return result
