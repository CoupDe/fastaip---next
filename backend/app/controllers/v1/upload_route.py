import io
from typing import List

import pandas as pd
from fastapi import APIRouter, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.visr_models import VisrModel, AdditionalPriceModel
from services.v1.import_sevice import create_visr
from db.base import get_async_session
from schemas.visr_schema import (
    ConfirmImport,
    ImportDataInfo,
    VisrSchema,
    EstimateSchema,
)
from services.v1.upload_service import check_file, create_dir, prepare_to_upload

route = APIRouter(prefix="/v1/import", tags=["import"])


@route.post("/{building_id}", response_model=ImportDataInfo)
async def upload_estimate(files: List[UploadFile], building_id: int) -> ImportDataInfo:
    excel_WB = io.BytesIO(files[0].file.read())
    # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    df_excel = pd.read_excel(excel_WB, sheet_name=None, header=None)
    evr_path = create_dir(building_id)

    temp_df_path = prepare_to_upload(df_excel, evr_path)
    response = {
        "filesInfo": [(files[0].filename, len(df_excel))],
        "detail": f"обработано {len(df_excel)} ЕВР",
        "tempFileId": temp_df_path,
        "confirmation": False,
    }
    # Возвращает header с содержанием пути к временному файлу

    # response.headers['X-Temp-Path'] = temp_df_path

    return response


def change_class(change: EstimateSchema):
    def ss():
        for s in change:
            print(s.local_num)

    return ss()


@route.post("/{building_id}/confirm/", response_model=VisrSchema)
async def confirm_import(
    confirmationInfo: ConfirmImport,
    building_id: int,
    session: AsyncSession = Depends(get_async_session),
) -> VisrSchema:
    """Подтверждение импорта файлов, принимает путь
    к временному документу(Исправить подход)"""
    visrs = check_file(**confirmationInfo.dict())

    change = VisrSchema(**visrs[0].dict())
    new = visrs[0]._data_to_db()
    print(new.estimates[0].estimated_prices)

    # ss = await create_visr(
    #     building_id,
    #     change,
    #     session,
    # )

    return visrs[0]
