
from datetime import datetime
from io import BytesIO
import os
import tempfile
from schemas.preparingVisr_schema import PreparingVisr
import uuid


def create_dir(building_id: int) -> str:
    """
    :param building_id: id объекта строительства для создания директории с указанием id объекта
    :return str: - > относительный путь с созданной директорией
    Создает директории формата date_import/id/time#counter
    c автоинкрементом в случае единовременного создания
    каталога в рамках одной минуты

    """
    upload_dir = os.path.dirname(os.getcwd()) + '/upload_files'
    relative_path = os.path.relpath(upload_dir)
    today = datetime.date(
        datetime.today()).strftime('%d-%m-%Y')
    current_time = datetime.now().strftime('%H_%M')
    full_path = os.path.join(
        relative_path, today, str(building_id),  f'{current_time}')

    if (not os.path.exists(full_path)):

        os.makedirs(full_path)
        return full_path
    else:
        counter: int = 1
        evr_path = full_path + f'#{counter}'
        while os.path.exists(full_path + f'#{counter}'):
            counter += 1
            evr_path = full_path + f'#{counter}'
        os.makedirs(evr_path)
    return evr_path


def prepare_to_upload(excel_wb: BytesIO, path: str) -> str:
    """
    :param excel_wb: Активная книга Excel
    :param path: Путь где будет расположен обработанный временный файл 
    :return str относительный путь к каталогу в котором создан временный файл с DataFrame в формате csv
    """
    evr_count = 0
    test_lst = []

    for sheet_name, sheet in excel_wb.items():
        parseVisr = PreparingVisr(sheet)
        parseVisr.set_field_category()
        test_lst.append(parseVisr.get_estimate)
        evr_count += 1
    with tempfile.NamedTemporaryFile(suffix='.csv', delete=False, dir=path) as temp_file:
        # Сохранение списка DataFrame в файл CSV
        for i, df in enumerate(test_lst):
            df.to_csv(temp_file, mode='a', index=False)

    # Получение пути к временному файлу

    return os.path.relpath(temp_file.name)
