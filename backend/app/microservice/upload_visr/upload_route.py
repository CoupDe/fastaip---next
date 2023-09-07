import io
from typing import List, Optional
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from .upload_visr_schema import  UploadFileResponse
from .upload_service import TempFileManager
from .excel_visr_stats_service import ExcelAnalyzer


from services.v1.upload_form_service import (
    get_form_data,
    insert_form_data,
    create_form,
)
from services.v1.import_service import create_visr_obj, check_visr_BD, create_visr
from db.base import get_async_session
from schemas.visr_schema import ConfirmImport, VisrBaseSchema


route = APIRouter(prefix="/v1/import", tags=["import"])


@route.post("/visr/{building_id}", response_model=UploadFileResponse )
async def upload_estimate(
    files: list[UploadFile], building_id: int
) -> UploadFileResponse:
    """Получения файлов в виде Excel с вложенными листами с содержанием ВИСР-ов

    Args:
        files (list[UploadFile]): *.xlsx
        building_id (int): Код стройки

    Raises:
        HTTPException: Файлы обработанны но пустые
        HTTPException: _description_

    Returns:
        UploadFileResponse: _description_
    """
    # Реализовано пока на одном файле

    excel_WB = io.BytesIO(files[0].file.read())  # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    try:
        df_visr = ExcelAnalyzer(excel_WB) 
        if df_visr.isNotEmpty: # Проверка найдены ли листы с ВИСР
            df_visr.pre_save_processing_data()
            file_manager = TempFileManager(
                building_id=building_id,
                processed_data_with_id=df_visr.processed_data_with_id,
                processed_data_non_id=df_visr.processed_data_non_id,
            )
            file_manager.create_dir()
            await file_manager.create_temp_file()
            return UploadFileResponse(
                **file_manager.model_dump(),
                stats=df_visr.get_stats(),
            )

        else:
            raise HTTPException(
                status_code=400, detail="Данных для обработки не выявлено"
            )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Возникла ошибка: {err}")



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
async def upload_form(
    files: List[UploadFile],
    building_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    print("In from Import")
    try:
        excel_WB = io.BytesIO(files[0].file.read())
        df_raw_data_form = pd.read_excel(excel_WB, sheet_name=0)
    except Exception as e:
        print(f"In Export excel {e}")

    df_normalized_data_form = get_form_data(df_raw_data_form)
    transform_data, errors_list = create_form(df_normalized_data_form)
    # await test_insert(building_id, transform_data[1:3500], session=session)
    try:
        test = await insert_form_data(building_id, transform_data, session=session)
    except Exception as e:
        print(f"{e} ошибка при добавлении в БД")
    df_normalized_data_form.to_excel("form.xlsx")
    return
