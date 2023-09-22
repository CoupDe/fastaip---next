from asyncio import sleep
import asyncio
import os
import shutil
import tempfile
from datetime import datetime
from typing import Any
import aiofiles
import aiofiles.os
from fastapi import HTTPException
from pandas import DataFrame
import pandas as pd
from pydantic import BaseModel, ConfigDict, computed_field
import redis

from schemas.visr_schema import ConfirmImport
from .temp_file_controller_queue import TempFileTaskManager
from db_redis.redis_connection import RedisKeyGenerator
from .temp_file_controller_queue import TempFileTaskManager
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
    redis_key_id: str | None = None
    redis_key_non_id: str | None = None
    temp_file_name: str | None = None
    temp_file_name_id: str | None = None
    temp_file_name_non_id: str | None = None
    temp_file_tasks_queue: TempFileTaskManager

    @computed_field
    def redis_key(self) -> str:
        return RedisKeyGenerator.path_generator(self.building_id, self.temp_file_name)

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
        """Проверяет есть ли данные с ID или без и сохраняет во временные каталоги

        Args:
            id (bool): _description_

        Returns:
            str: путь к временному файлу
        """
        file_name = "_id.csv" if id else "_non_id.csv"
        attribute_name = "redis_key_id" if id else "redis_key_non_id"
        data_to_write = (
            self.processed_data_with_id if id else self.processed_data_non_id
        )
        with tempfile.NamedTemporaryFile(
            suffix=file_name, delete=False, dir=self.temp_base_folder
        ) as temp_file:
            # Сохранение списка DataFrame в файл CSV
            for df in data_to_write:
                df.to_csv(temp_file, mode="a", index=False)
                self.temp_file_name = os.path.basename(temp_file.name)
        setattr(self, attribute_name, self.redis_key)  # формирует ключи для записи
        return os.path.basename(temp_file.name)

    ##################################
    #!!!!!!!!!!!В случае обработки файла, оставить его в каталоге
    async def key_expire_listner(self, channel: redis.client.PubSub):
        """Функция слушает если пользователь не отреагировал на сообщение о импорте,
        через некоторое время функция удаляет временные каталоги"""

        if self.temp_base_folder:
            # Существует ли каталог
            if await aiofiles.os.path.exists(self.temp_base_folder):
                temp_files = await aiofiles.os.listdir(self.temp_base_folder)
                await asyncio.sleep(280)
                # Есть ли файлы в каталоге
                if len(temp_files) > 0:
                    # пока не очистится список от вложенных файлов в базовый каталог
                    while temp_files:
                        # Получение сообщений от издателя
                        message = await channel.get_message(
                            ignore_subscribe_messages=True
                        )

                        # Проверка сообщения на окончание TTL ключа
                        if (
                            message is not None
                            and message["data"] == "expired"
                        ):
                            deleted_key: str = message["channel"]
                            for file in temp_files:
                                if file in deleted_key:
                                    full_path = os.path.join(
                                        self.temp_base_folder, file
                                    )
                                    if await aiofiles.os.path.exists(full_path):
                                        await aiofiles.os.remove(full_path)
                                        temp_files.remove(file)
                    # Удаление каталога после удаления вложенных файлов
                    await aiofiles.os.rmdir(self.temp_base_folder)
                elif self.temp_base_folder is not None:
                    await aiofiles.os.rmdir(self.temp_base_folder)
                    return
                else:
                    return
            else:
                return

    ##################################
    async def save_to_redis(self) -> list[str | None]:
        """Создает ключи с для Redis с меткой о типе ВИСР с id или без

        Returns:
            list[str]: список ключей
        """
        redis_path_key = []
        if self.path_to_visr_id:
            await redis_connect.set(self.redis_key_id, self.path_to_visr_id, ex=300)

            redis_path_key.append(self.redis_key_id)
        if self.path_to_visr_non_id:
            await redis_connect.set(
                self.redis_key_non_id, self.path_to_visr_non_id, ex=300
            )
            redis_path_key.append(self.redis_key_non_id)

        return redis_path_key

    async def create_temp_file(self):
        """Создание временного файла и присвоение пути к веременному файлу с ид и без
        Создает корутины для проверке удалены ли временные файлы, и удаляет их"""
        path_subscriber = redis_connect.pubsub()
        await path_subscriber.psubscribe(
            "__keyspace@*:*build*temp_file*", "__keyevent@*:expired"
        )

        if self.processed_data_with_id:
            self.temp_file_name_id = self.save_temp_file(id=True)
            self.path_to_visr_id = os.path.join(
                self.temp_base_folder, self.temp_file_name_id
            )
        if self.processed_data_non_id:
            self.temp_file_name_non_id = self.save_temp_file(id=False)
            self.path_to_visr_non_id = os.path.join(
                self.temp_base_folder, self.temp_file_name_non_id
            )

        task_del_temp_path = asyncio.create_task(
            self.key_expire_listner(path_subscriber)
        )

        await self.temp_file_tasks_queue.add_task(
            self.temp_base_folder, task_del_temp_path, redis_connect
        )

        # В Redis лучше случайные ключи реализоаывать в формате SHA1, в иделае ключ
        # должен отражать привязку к клиенту или к стройке и нести ссмысловой контекст т.д.

        ss = await self.save_to_redis()

        # await task_del_temp_path

        # ss1 = await redis_connect.mget(temp_keys)
        # print("ss1", ss1)


# def prepare_to_upload(excel_wb: DataFrame, path: str) -> str:
#     """
#     :param excel_wb: Активная книга Excel
#     :param path: Путь где будет расположен обработанный временный файл
#     :return str относительный путь к каталогу в котором создан временный
#     файл с DataFrame в формате csv
#     """
#     evr_count = 0
#     test_lst = []

#     for _sheet_name, sheet_df in excel_wb.items():
#         parseVisr = PreparingVisr(sheet_df)

#         parseVisr.set_field_category()

#         test_lst.append(parseVisr.get_estimate)
#         evr_count += 1
#     with tempfile.NamedTemporaryFile(
#         suffix=".csv", delete=False, dir=path
#     ) as temp_file:
#         # Сохранение списка DataFrame в файл CSV
#         for df in test_lst:
#             df.to_csv(temp_file, mode="a", index=False)

#     # Получение пути к временному файлу

#     temp_path = os.path.relpath(os.path.dirname(temp_file.name))
#     temp_file_name = os.path.basename(temp_file.name)
#     temp_folder.append({temp_file_name: temp_path})

#     return temp_file_name


async def check_file(data_to_import: ConfirmImport) -> DataFrame | HTTPException:
    """
    Функция поиска пути для удаления или дальнейшей обработки

    :param confirmation: если тру обработать файлы для
    размещения в бд, иначе удалить

    """
    # Надо разобраться, есть решения но я их не понимаю, связанны с typeGuard MyPy
    # найти путь по ключу ID временного файла
    # tmp_file: dict[Any, Any] = next(
    #     filter(lambda file: tempFileId in file, temp_folder), None
    # )

    temp_paths: list[str] = await redis_connect.mget(*data_to_import.file_paths)
    print(type(temp_paths[0]))
    if temp_paths:
        if data_to_import.confirmation:
            for file in temp_paths:
                # Полный путь к файлу для создания DF

                visrs_df = pd.read_csv(file)
                print("visrs_df,(visrs_df)", visrs_df)
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
