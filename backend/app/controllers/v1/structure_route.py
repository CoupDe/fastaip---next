from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.base import get_async_session
from schemas import structure_schema
from schemas.structure_schema import Structure, UpdateStructure
from services.v1 import structure_service

route = APIRouter(prefix="/v1/construction", tags=["construction"])


@route.get("/all", response_model=list[structure_schema.StructureBuilding])
async def read_all_structures(session: AsyncSession = Depends(get_async_session)):
    structures = await structure_service.read_all_structures(session)
    return structures


@route.get("/{structure_id}", response_model=structure_schema.Structure)
async def read_structure(
    structure_id: int, session: AsyncSession = Depends(get_async_session)
):
    structure = await structure_service.read_structure(structure_id, session)
    if not structure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return structure


@route.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=structure_schema.Structure
)
async def create_structure(
    structure: structure_schema.CreateStructure,
    session: AsyncSession = Depends(get_async_session),
) -> Structure | None:
    """
    Raises:
        HTTPException: при совпадении кода объекта
    """
    db_structure = await structure_service.get_structure_by_code_name(
        **structure.dict(exclude={"structure_id"}), session=session
    )
    if db_structure:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Объект с таким кодом или названием присутсвует в БД",
        )
    return await structure_service.create_structure(structure, session=session)


# @route.patch('/{structure_id}', response_model=structure_schema.Structure)


@route.patch("/{structure_id}", response_model=structure_schema.UpdateStructure)
async def update_structure(
    structure: structure_schema.UpdateStructure,
    session: AsyncSession = Depends(get_async_session),
) -> UpdateStructure | None:
   
    structures = await structure_service.patch_structure(structure, session=session)

   

    return structures
    # if not structure:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    # return structure


@route.delete("/{structure_id}", status_code=status.HTTP_200_OK)
async def delete_structure(
    structure_id: int, session: AsyncSession = Depends(get_async_session)
) -> dict:
    result = await structure_service.delete_structure(structure_id, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return {"deleted_item": result}
