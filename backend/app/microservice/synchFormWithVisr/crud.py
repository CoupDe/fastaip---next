from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from services.v1 import formks_service
from db.models.visr_models import VisrModel
from schemas.formks_visrbase_schema import TestModel
from db.models.form_ks_model import FormKS


async def get_comparse_data(building_id: int, session: AsyncSession) -> int:
    """Получение совпадений данных в форме и детализированного ВИСР по visr_id"""

    stmt_form = (
        select(FormKS, VisrModel)
        .join(VisrModel, VisrModel.visrs_id == FormKS.visr_identifier)
        .options(joinedload(FormKS.visr))
        .where(
            (FormKS.building_id == building_id) & (VisrModel.building_id == building_id)
        )
    )
    result = await session.execute(stmt_form)
    rows = result.all()
    for form, visr in rows:
        form.visr = visr

    await session.commit()
    return len(rows)
