import json
from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import formKs_schema
from services.v1.formks_service import get_all_data, paginate

from db.base import get_async_session


route = APIRouter(prefix="/v1/form", tags=["form"])


@route.get("/{building_id}", response_model=list[formKs_schema.FormKsWithId])
async def get_all_formData(
    building_id: int,
    page: int,
    limit: int,
    session: AsyncSession = Depends(get_async_session),
):
    result = await paginate(building_id, page, limit, session)
   
    return result
