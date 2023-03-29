

from schemas.building_schema import CreateBuilding
from sqlalchemy.ext.asyncio import AsyncSession


async def create_Building(building: CreateBuilding, session: AsyncSession):
    print (building)
    pass
