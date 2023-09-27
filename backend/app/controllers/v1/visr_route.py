from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from db.base import get_async_session
from schemas.visr_schema import VisrSchema

from services.v1 import structure_visr_service

route = APIRouter(prefix="/v1/building", tags=["buildingVIsr"])


@route.get("/{building_id}/allVisr", response_model=list[VisrSchema])
async def get_all_building_visr(
    building_id: int, session: AsyncSession = Depends(get_async_session)
):
    visrs = await structure_visr_service.get_all_building_visr(building_id, session)
 
    return visrs
