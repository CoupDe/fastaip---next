import os
import shutil
import tempfile
from datetime import datetime
from io import BytesIO

from pandas import DataFrame

from schemas.upload_schema import PreparingVisr
from services.v1.import_sevice import filter_data

# список созданных каталогов
temp_folder = []


def create_dir(building_id: int) -> str:
    """
    :param building_id: id объекта строительства для создания директории
    с указанием id объекта
    :return str: - > относительный путь с созданной директорией
    Создает директории формата date_import/id/time#counter
    c автоинкрементом в случае единовременного создания
    каталога в рамках одной минуты

    """
    upload_dir = os.path.dirname(os.getcwd()) + "/upload_files"
    relative_path = os.path.relpath(upload_dir)
    today = datetime.date(datetime.today()).strftime("%d-%m-%Y")
    current_time = datetime.now().strftime("%H_%M")
    full_path = os.path.join(relative_path, today, str(building_id), f"{current_time}")

    if not os.path.exists(full_path):
        os.makedirs(full_path)
        return full_path
    else:
        counter: int = 1
        evr_path = full_path + f"#{counter}"
        while os.path.exists(full_path + f"#{counter}"):
            counter += 1
            evr_path = full_path + f"#{counter}"
        os.makedirs(evr_path)
    return evr_path


def prepare_to_upload(excel_wb: DataFrame, path: str) -> str:
    """
    :param excel_wb: Активная книга Excel
    :param path: Путь где будет расположен обработанный временный файл
    :return str относительный путь к каталогу в котором создан временный
    файл с DataFrame в формате csv
    """
    evr_count = 0
    test_lst = []

    for _sheet_name, sheet_df in excel_wb.items():
        parseVisr = PreparingVisr(sheet_df)

        parseVisr.set_field_category()

        test_lst.append(parseVisr.get_estimate)
        evr_count += 1
    with tempfile.NamedTemporaryFile(
        suffix=".csv", delete=False, dir=path
    ) as temp_file:
        # Сохранение списка DataFrame в файл CSV
        for df in test_lst:
            df.to_csv(temp_file, mode="a", index=False)

    # Получение пути к временному файлу

    temp_path = os.path.relpath(os.path.dirname(temp_file.name))
    temp_file_name = os.path.basename(temp_file.name)
    temp_folder.append({temp_file_name: temp_path})

    return temp_file_name


def check_file(tempFileId: str, confirmation: bool) -> None:
    """
    Функция поиска пути для удаления или дальнейшей обработки

    :param confirmation: если тру обработать файлы для
    размещения в бд, иначе удалить

    """
    # найти путь по ключу ID временного файла
    tmp_file: dict = next(filter(lambda file: tempFileId in file, temp_folder), None)

    if tmp_file is not None:
        if confirmation:
            # Полный путь к файлу для создания DF
            temp_csv = f"{tmp_file[tempFileId]}\{tempFileId}"  # noqa Потом Убрать
            filter_data("..\\upload_files\\23-06-2023\\9\\11_35\\tmpb_u9ckd2.csv")

        else:
            shutil.rmtree(tmp_file[tempFileId])
            # исключить найденный путь из глобальнго списка объектов
            temp_folder.remove(tmp_file)

    else:
        # !!!УБРАТЬ
        filter_data("..\\upload_files\\23-06-2023\\9\\11_35\\tmpb_u9ckd2.csv")
        # raise HTTPException(
        #     status_code=404, detail="Файл обработан или удален")
