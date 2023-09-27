from sqlalchemy import select, asc
from sqlalchemy.ext.asyncio import AsyncSession
from db.models.visr_models import (
    VisrModel,
    EstimateModel,
    EstimatedPriceModel,
)


from sqlalchemy.orm import selectinload, subqueryload
from schemas.visr_schema import VisrSchema


async def get_all_building_visr(
    building_id: int, session: AsyncSession
) -> list[VisrModel]:
    stmt = (
        select(VisrModel)
        .where(VisrModel.building_id == building_id)
        .options(
            selectinload(VisrModel.estimates)
            .selectinload(EstimateModel.estimated_prices)
            .selectinload(EstimatedPriceModel.labors),
            selectinload(VisrModel.estimates)
            .selectinload(EstimateModel.estimated_prices)
            .selectinload(EstimatedPriceModel.additional_prices),
        )
    )

    result = await session.execute(stmt)

    return list(result.scalars().all())
