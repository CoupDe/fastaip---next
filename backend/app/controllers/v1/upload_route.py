import io
import pandas as pd
from typing import List
from fastapi import APIRouter, FastAPI, Response, UploadFile, Header, Request
from fastapi.responses import JSONResponse
from schemas.visr_schema import ImportDataInfo
from services.v1.upload_service import prepare_to_upload,  create_dir

route = APIRouter(prefix='/v1/import', tags=['import'])

app = FastAPI()


class ParseDataException(Exception):
    def __init__(self, message: str) -> None:
        self.name = message


@app.exception_handler(ParseDataException)
async def parse_data_handler(request: Request, exc: ParseDataException):
    return JSONResponse(
        status_code=418,
        content={
            "message": f"Oops! {exc.name} did something. There goes a rainbow..."},
    )


@route.post('/{building_id}', response_model=ImportDataInfo)
async def upload_estimate(files: List[UploadFile], building_id: int, response: Response) -> ImportDataInfo:

    excel_WB = io.BytesIO(
        files[0].file.read())

    df_excel = pd.read_excel(excel_WB, sheet_name=None,
                             header=None)
    evr_path = create_dir(building_id)

    temp_df_path = prepare_to_upload(df_excel, evr_path)
    response = {'filesInfo': [(files[0].filename, len(df_excel))],
                'detail': f'обработано {len(df_excel)} ЕВР', 'tempFilePath': temp_df_path}
    # Возвращает header с содержанием пути к временному файлу

    # response.headers['X-Temp-Path'] = temp_df_path

    return response
