from fastapi import APIRouter, Depends, HTTPException, status
from db.base import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import structure_schema
from services.v1 import structure_service
from sqlalchemy.exc import IntegrityError
route = APIRouter(prefix='/v1/projects', tags=['structures'])


@route.get('/', response_model=list[structure_schema.Structure])
async def read_all_structures(session: AsyncSession = Depends(get_async_session)):
    structures = await structure_service.read_all_structures(session)
    return structures


@route.get('/{structure_id}')
def read_structure(session: AsyncSession = Depends(get_async_session)):
    pass


@route.post('/', status_code=status.HTTP_201_CREATED)
async def create_structure(structure: structure_schema.CreateStructure, session: AsyncSession = Depends(get_async_session)) -> None:

    """
    Raises:
        HTTPException: при совпадении кода объекта
    """
    print('structure', structure)
    try:
        await structure_service.create_structure(structure, session)
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Такая запись присутсвует в базе данных')


@route.patch('/{structure_id}')
def update_structure():
    pass


@route.delete('/{structure_id}')
def delete_structure():
    pass
