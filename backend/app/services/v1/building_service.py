from sqlalchemy import asc, delete, insert, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from db.models.building_model import Building
from schemas import building_schema


async def read_all_buildings(session: AsyncSession) -> list[Building]:
    """_summary_
    order_by->asc;
    error: greenlet error
    Необходимо добавлять .options(selectinload(Structure.buildings)  в синхронной среде он может
    лениво загружать отношения но в асинхронной среде это невозможно с помощью selectinload он
    явно предварительно загружает отношения.
    """
    stmt = (
        select(Building)
        .where(Building.id > 0)
        .options(selectinload(Building.structure))
        .order_by(asc(Building.name))
    )
    result = await session.scalars(stmt)
    return list(result.all())


"""session.get(Structure,id)->чем отличается от нижеуказанного """


async def read_building(id: int, session: AsyncSession) -> Building:
    building = await session.get(Building, id)
    return building


async def get_building_by_code_name(
    name: str, code_building: str, session: AsyncSession
):
    building = await session.scalar(
        select(Building).where(
            or_(Building.name == name, Building.code_building == code_building)
        )
    )
    return building


async def create_building(
    building: building_schema.CreateBuilding, session: AsyncSession
) -> Building | None:
    result = await session.scalar(
        insert(Building).values(**building.model_dump()).returning(Building)
    )
    await session.commit()
    return result


"""Проверить как ведет себя таблица ребенка"""


async def delete_building(id: int, session: AsyncSession) -> str | None:
    stmt = delete(Building).where(Building.id == id).returning(Building.name)
    result = await session.scalar(stmt)
    await session.commit()
    return result
