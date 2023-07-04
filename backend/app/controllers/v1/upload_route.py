import io
from typing import List

import pandas as pd
from fastapi import APIRouter, Response, UploadFile

from schemas.visr_schema import ConfirmImport, ImportDataInfo
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


@route.post("/{building_id}/confirm/")
async def confirm_import(confirmationInfo: ConfirmImport, building_id: int):
    """Подтверждение импорта файлов, принимает путь
    к временному документу(Исправить подход)"""
    check_file(**confirmationInfo.__dict__)
    return confirmationInfo
