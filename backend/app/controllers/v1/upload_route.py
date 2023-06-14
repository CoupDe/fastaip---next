import io
import pandas as pd
from typing import Annotated, List
from fastapi import APIRouter, FastAPI, UploadFile, File, Request
from fastapi.responses import JSONResponse
from schemas.preparingVisr_schema import PreparingVisr

from services.v1.upload_service import create_dir, get_data_VISR, get_general_data
from db.base import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
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


@route.post('/{building_id}')
async def upload_estimate(files: List[UploadFile], building_id: int):

    print('files[0]', files[0].content_type)

    excel_WB = io.BytesIO(
        files[0].file.read())

    df_excel = pd.read_excel(excel_WB,
                             header=None)
    # init class
    parseVisr = PreparingVisr(df_excel)
    # print('parseVisr', parseVisr)
    # Set column
    parseVisr.set_header()
    # chek_stat

    parseVisr.set_field_category()

    df_visr = get_data_VISR(df_excel)

    # Get general data
    new_visr = await get_general_data(df_visr.loc[3:4, 'pos'])
    # new_visr.set_chapter(df_visr.loc[17, ])

    # df_excel.columns = ['pos', 'code', 'name', 'unit',
    #                     'quantity', 'unit_coast', 'total_cost']
    # get_data_VISR(df_excel)

    # loc_num: str = df_visr_lim.loc[17]['code']
    # for index, row in df_visr_lim.iterrows():
    #     print(row)

    # print(loc_num.split())  # get programm_Num & estimate_num
    # print(visr.loc[12:, 'pos':'quantity'])

    create_dir(building_id)
    return {'fileName': f"fileName {df_excel.shape}"}
