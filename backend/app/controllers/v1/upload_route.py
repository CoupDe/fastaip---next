import io
from typing import List, Optional

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from services.v1.upload_form_service import get_form_data


from db.models.visr_models import VisrModel, AdditionalPriceModel
from services.v1.import_service import create_visr_obj, check_visr_BD, create_visr
from db.base import get_async_session
from schemas.visr_schema import ConfirmImport, ImportDataInfo, VisrBaseSchema
from services.v1.upload_service import check_file, create_dir, prepare_to_upload

route = APIRouter(prefix="/v1/import", tags=["import"])


@route.post("/visr/{building_id}", response_model=ImportDataInfo)
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


@route.post(
    "/visr/{building_id}/confirm", response_model=None | dict[str, list[VisrBaseSchema]]
)
async def confirm_import(
    confirmationInfo: ConfirmImport,
    building_id: int,
    session: AsyncSession = Depends(get_async_session),
) -> Optional[dict[str, list[VisrBaseSchema]] | Response]:
    """Подтверждение импорта файлов, принимает путь
    к временному документу"""
    # Удалени или создание Dataframe
    visrs_dataframe = check_file(**confirmationInfo.dict())
    if not visrs_dataframe.empty:
        # Получение списка ВИСР
        visrs = create_visr_obj(visrs_dataframe, building_id)
        # Исклчение дублирование ВИСР в БД
        visr_to_import = await check_visr_BD(visrs, building_id, session)
        if visr_to_import:
            # Создание записей в БД
            created_visrs = await create_visr(
                building_id,
                visr_to_import,
                session,
            )

            return {"detail": created_visrs}
        else:
            return JSONResponse(
                content={"detail": "Импортируемые ВИСР уже присутствуют в БД"},
                status_code=status.HTTP_409_CONFLICT,
            )
    else:
        raise HTTPException(status_code=500, detail="Данные не обработаны")


# Загрузка формы КС-6
@route.post(
    "/form/{building_id}",
)
def upload_form(files: List[UploadFile], building_id: int):
    print("In from Import")
    try:
        excel_WB = io.BytesIO(files[0].file.read())
        # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        df_raw_form = pd.read_excel(excel_WB, sheet_name=0)
    except Exception as e:
        print(f"In Export excel {e}")

    df_normalized_form = get_form_data(df_raw_form)

    df_normalized_form.to_excel("form.xlsx")
    return
