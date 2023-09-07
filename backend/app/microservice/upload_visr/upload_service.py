import os
import shutil
import tempfile
from datetime import datetime
from typing import Any
from fastapi import HTTPException
from pandas import DataFrame
import pandas as pd
from pydantic import BaseModel, ConfigDict, computed_field
from db_redis.redis_connection import RedisKeyGenerator

from db_redis.redis_connection import redis_connect


from .prepare_visr_data_service import PreparingVisr


# список созданных каталогов
temp_folder = []


class TempFileManager(BaseModel):
    """Класс для создания временного каталога для файлами с кодировкой
    ВИСР и в случае отсутсвия, файл без кодировки ВИСР
    """

    model_config = ConfigDict(arbitrary_types_allowed=True)

    building_id: int
    temp_base_folder: str | None = None
    processed_data_with_id: list[DataFrame]
    processed_data_non_id: list[DataFrame]
    path_to_visr_id: str | None = None
    path_to_visr_non_id: str | None = None

    @computed_field
    def redis_key(self) -> bytes:  # converted to a `property` by `computed_field`
        return RedisKeyGenerator.path_generator(self.building_id, self.temp_base_folder)

    def create_dir(self) -> None:
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
        full_path = os.path.join(
            relative_path, today, str(self.building_id), f"{current_time}"
        )

        if not os.path.exists(full_path):
            os.makedirs(full_path)
            evr_path = full_path
        else:
            counter: int = 1
            evr_path = full_path + f"#{counter}"
            while os.path.exists(full_path + f"#{counter}"):
                counter += 1
                evr_path = full_path + f"#{counter}"
            os.makedirs(evr_path)
        self.temp_base_folder = evr_path

    def save_temp_file(self, id: bool) -> str:
        file_name = "_id.csv" if id else "_no_id.csv"
        data_to_write = (
            self.processed_data_with_id if id else self.processed_data_non_id
        )
        with tempfile.NamedTemporaryFile(
            suffix=file_name, delete=False, dir=self.temp_base_folder
        ) as temp_file:
            # Сохранение списка DataFrame в файл CSV
            for df in data_to_write:
                df.to_csv(temp_file, mode="a", index=False)
        return os.path.basename(temp_file.name)

    async def save_to_redis(self):
        fields = {
            "path_to_visr_id": self.path_to_visr_id,
            "path_to_visr_non_id": self.path_to_visr_non_id,
        }
        await redis_connect.hset(self.redis_key, {**self.path_to_visr_id,**self.path_to_visr_non_id})

    async def create_temp_file(self):
        """Создание временного файла и присвоение пути к веременному файлу с ид и без"""
        if self.processed_data_with_id:
            temp_file_name = self.save_temp_file(id=True)
            self.path_to_visr_id = os.path.join(self.temp_base_folder, temp_file_name)
        if self.processed_data_with_id:
            temp_file_name = self.save_temp_file(id=False)
            self.path_to_visr_non_id = os.path.join(
                self.temp_base_folder, temp_file_name
            )
        # В Redis лучше слычайные ключи реализоаывать в формате SHA1, в иделае ключ
        # должен отражать привязку к клиенту или к стройке и т.д.

        await self.save_to_redis()
        ss = await redis_connect.hget(self.redis_key)
        print(ss)


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


def check_file(tempFileId: str, confirmation: bool) -> DataFrame | HTTPException:
    """
    Функция поиска пути для удаления или дальнейшей обработки

    :param confirmation: если тру обработать файлы для
    размещения в бд, иначе удалить

    """
    # Надо разобраться, есть решения но я их не понимаю, связанны с typeGuard MyPy
    # найти путь по ключу ID временного файла
    tmp_file: dict[Any, Any] = next(
        filter(lambda file: tempFileId in file, temp_folder), None
    )

    if tmp_file is not None:
        if confirmation:
            # Полный путь к файлу для создания DF
            temp_csv = f"{tmp_file[tempFileId]}\{tempFileId}"  # noqa Потом Убрать
            visrs_df = pd.read_csv(
                "..\\upload_files\\23-06-2023\\9\\11_35\\tmpb_u9ckd2.csv"
            )
            return visrs_df

        else:
            shutil.rmtree(tmp_file[tempFileId])
            # исключить найденный путь из глобальнго списка объектов
            temp_folder.remove(tmp_file)
            raise HTTPException(status_code=200, detail="Каталог удален")

    else:
        # !!!УБРАТЬ
        visrs_df = pd.read_csv(
            "..\\upload_files\\23-06-2023\\9\\11_35\\tmpb_u9ckd2.csv"
        )
        return visrs_df
        # !!!УБРАТЬ
        # raise HTTPException(status_code=404, detail="Файл обработан или удален")
