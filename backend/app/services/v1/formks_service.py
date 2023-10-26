from fastapi import Depends
from sqlalchemy import select
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
    bulding_id: int, page:int,limit:int,session: AsyncSession = Depends(get_async_session)
) -> list[FormKS]:
    print('page',page)
    offset = (page-1) * limit
    print('offset',offset)
    stmt = select(FormKS).offset(offset).limit(limit)
    result = await session.scalars(stmt)
    formks_list = list(result.all())
   
    return formks_list
