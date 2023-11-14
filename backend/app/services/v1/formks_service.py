from fastapi import Depends
from sqlalchemy import Null, select
from db.base import get_async_session
from db.models.form_ks_model import FormKS
from schemas import formKs_schema
from sqlalchemy.ext.asyncio import AsyncSession


async def get_all_data(
    bulding_id: int, session: AsyncSession = Depends(get_async_session)
) -> list[FormKS]:
    stmt = select(FormKS).where(FormKS.building_id == bulding_id)
    result = await session.scalars(stmt)
    formks_list = list(result.all())
    print(len(formks_list))
    return formks_list


async def paginate(
    bulding_id: int,
    page: int,
    limit: int,
    session: AsyncSession = Depends(get_async_session),
) -> list[FormKS]:
    offset = (page - 1) * limit
    stmt = select(FormKS).where(FormKS.visr_id is not None).offset(offset).limit(limit)
    result = await session.scalars(stmt)
    formks_list = list(result.all())
    for form in formks_list:
        if form.visr_id != None:
          
   

    return formks_list
