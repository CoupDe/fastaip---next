import io
from typing import List

import pandas as pd
from fastapi import APIRouter, Depends, Response, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from services.v1.import_sevice import get_visr
from services.v1.import_sevice import check_visr_BD

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


@route.post("/{building_id}/confirm/", response_model=None)
async def confirm_import(
    confirmationInfo: ConfirmImport,
    building_id: int,
    session: AsyncSession = Depends(get_async_session),
) -> None:
    """Подтверждение импорта файлов, принимает путь
    к временному документу(Исправить подход)"""
    visrs_dataframe = check_file(**confirmationInfo.dict())
    if not visrs_dataframe.empty:
        visrs = get_visr(visrs_dataframe, building_id)
        await check_visr_BD(visrs, building_id, session)
    # Добавить id к данным объекта VisrModel

    # ss = await create_visr(
    #     building_id,
    #     visrs[3],
    #     session,
    # )
