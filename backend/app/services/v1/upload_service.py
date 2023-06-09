
from datetime import datetime
import os
from fastapi import HTTPException

from pandas import DataFrame, Series

from schemas.visr_schema import Visr


def create_dir(building_id: int) -> None:
    """
    Создает директории формата date_import/id/time#counter
    c автоинкрементом в случае единовременного создания
    каталога в рамках одной минуты
    """
    upload_dir = os.path.dirname(os.getcwd()) + '/upload_files'
    today = datetime.date(
        datetime.today()).strftime('%d-%m-%Y')
    current_time = datetime.now().strftime('%H_%M')
    full_path = os.path.join(
        upload_dir, today, str(building_id),  f'{current_time}')

    if (not os.path.exists(full_path)):
        os.makedirs(full_path)
    else:
        counter: int = 1
        while os.path.exists(full_path + f'#{counter}'):
            counter += 1
        os.makedirs(full_path + f'#{counter}')


def get_data_VISR(dt: DataFrame) -> DataFrame:
    try:
        dt.columns = ['pos', 'code', 'name', 'unit',
                      'quantity', 'unit_cost', 'total_cost']
        return dt
    except ValueError as e:
        raise HTTPException(
            status_code=422, detail=f"Количество колонок не соответсвует требуемому формату, должно быть 7 колонок, присутвует {dt.shape[1]}")


async def get_general_data(row: Series) -> Visr:

    if (not row.isnull().values.any()):
        new_visr = Visr(name_visr=row[3], type_work=row[4])

        return new_visr
    raise HTTPException(
        status_code=422, detail=f"Значения в ячейках наименования или типе работ не должны быть пустыми")
