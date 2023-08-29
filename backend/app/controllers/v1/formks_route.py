import json
from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import formKs_schema
from services.v1.formks_service import get_all_data

from db.base import get_async_session


route = APIRouter(prefix="/v1/form", tags=["form"])


@route.get("/{building_id}", response_model=list[formKs_schema.FormKS])
async def get_all_formData(
    building_id: int, session: AsyncSession = Depends(get_async_session)
):
    result = await get_all_data(building_id, session)
    print(len(result))
    return result[:100]
