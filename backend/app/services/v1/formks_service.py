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
    building_id: int,
    page: int,
    limit: int,
    isFiltered: bool | None = None,
    session: AsyncSession = Depends(get_async_session),
) -> list[FormKS]:
    print("isFiltered,isFiltered", isFiltered)
    print("isFiltered,isFiltered", building_id)
    offset = (page - 1) * limit
    if isFiltered:
        stmt = (
            select(FormKS)
            .where(FormKS.visr_id.isnot(None) & (FormKS.building_id == building_id))
            .offset(offset)
            .limit(limit)
        )
    else:
        stmt = (
            select(FormKS)
            .where(FormKS.building_id == building_id)
            .offset(offset)
            .limit(limit)
        )
    result = await session.scalars(stmt)
    formks_list = list(result.all())

    return formks_list
