from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession
from schemas.formks_visrbase_schema import TestModel
from schemas import visr_schema
from schemas import formKs_schema
from microservice.synchFormWithVisr.crud import get_comparse_data


from db.base import get_async_session

router = APIRouter(
    prefix="/v1/synch",
    tags=["synch"],
)


@router.get("/{building_id}", tags=["synch"], response_model=int)
async def read_comparsion_data(
    building_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    result = await get_comparse_data(building_id, session)

    return result
