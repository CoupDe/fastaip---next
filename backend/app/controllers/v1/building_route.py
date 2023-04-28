from fastapi import APIRouter, Depends, HTTPException, status, Response
from schemas.building_schema import Building
from db.base import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import building_schema
from services.v1 import building_service
from sqlalchemy.exc import IntegrityError


route = APIRouter(prefix='/v1/building', tags=['building'])


@route.get('/all', response_model=list[building_schema.Building])
async def read_all_buildings(session: AsyncSession = Depends(get_async_session)):
    buildings = await building_service.read_all_buildings(session)
    return buildings


@route.get('/{building_id}', response_model=building_schema.Building)
async def read_building(building_id: int, session: AsyncSession = Depends(get_async_session)):
    building = await building_service.read_building(building_id, session)
    if not building:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return building


@route.post('/', status_code=status.HTTP_201_CREATED, response_model=building_schema.Building)
async def create_building(building: building_schema.CreateBuilding, session: AsyncSession = Depends(get_async_session)) -> Building | None:

    """

    Raises:
        HTTPException: при совпадении кода объекта
    """
    db_building = await building_service.get_building_by_code_name(
        **building.dict(exclude={'structure_id'}), session=session)
    if db_building:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Объект с таким кодом или названием присутсвует в БД')
    return await building_service.create_building(building, session=session)


@route.patch('/{building_id}')
async def update_building():
    pass


@route.delete('/{building_id}', status_code=status.HTTP_200_OK)
async def delete_building(building_id: int,  session: AsyncSession = Depends(get_async_session)) -> dict:
    result = await building_service.delete_building(building_id, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return {'deleted_item': result}
