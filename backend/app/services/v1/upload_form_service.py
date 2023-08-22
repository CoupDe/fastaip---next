import time
from typing import List, Tuple
from typing_extensions import TypedDict
from numpy import NaN
from pandas import DataFrame
from pydantic import ValidationError
import numpy as np
from sqlalchemy import insert, select
from db.models.form_ks_model import FormKS
from schemas import formKs_schema
from sqlalchemy.dialects import postgresql
from support.timer_dec import timer_async
from sqlalchemy.ext.asyncio import AsyncSession

# Удаляет все строки где в колнке 'позиции по Виду и стоимости работ' пусто, так как не привяжется ВИСР


fillNa_values = {
    "type_work": "",
    "unit": "",
    "quantity": np.nan,
    "unit_cost": np.NaN,
    "total_cost": np.NaN,
}


def get_form_data(df_excel: DataFrame) -> DataFrame:
    """Конвертация данных из EXCEL в DataFrame с исключением лишних колонок и строк с пустыми значениями кодировки ВИСР

    Args:
        df_excel (DataFrame): _description_

    Returns:
        DataFrame: чистый DF
    """
    # Исходя из получаемого формата взять 9 колонок
    pure_df = df_excel.iloc[:, 1:10]
    # Удалить все строки где отсутсвуют значения в колонке 'visr_identifier' axis=строка
    pure_df = pure_df.dropna(axis=0, subset=pure_df.columns[0]).reset_index(drop=True)
    # Присвоить имена колонкам, заменить pd.nan на None
    pure_df = pure_df.set_axis(
        [
            "visr_identifier",
            "building_code",
            "blueprint_project_number",
            "local_num",
            "type_work",
            "unit",
            "quantity",
            "unit_cost",
            "total_cost",
        ],
        axis=1,
    ).replace(np.nan, None)

    return pure_df


def create_form(
    normalized_data: DataFrame,
) -> Tuple[list[formKs_schema.FormKS], list[formKs_schema.MyInfoError]]:
    """Валидация данных посредством создания класса Pydantic

    Args:
        df_excel (DataFrame): _description_

    Returns:
        list[FromKS]: _description_
    """
    created_objects = []
    validation_errors = []
    for row in normalized_data.itertuples():
        try:
            new_obj = formKs_schema.FormKS(**row._asdict())
            created_objects.append(new_obj)
        except ValidationError as e:
            validation_errors.append(
                formKs_schema.MyInfoError(
                    index=row.Index, errorObj=e.errors(), row_data=row
                )
            )
    return (created_objects, validation_errors)


def transaction_range(max: int):
    ss = 0

    def inner() -> slice:
        nonlocal ss
        res = slice(ss, ss + 1000)
        ss += 1000
        return res

    return inner


def chunks(formKs, chunk_size=1000):
    """Генератор чанков для данных из FormKs."""
    for i in range(0, len(formKs), chunk_size):
        yield formKs[i : i + chunk_size]


# /List[formKs_schema.FormKS]
@timer_async
async def insert_form_data(
    building_id: int, formKs: List[formKs_schema.FormKS], session: AsyncSession
) -> int:
    if len(formKs) > 2500:
        for chunk_data in chunks(formKs):
            data_to_db = [
                {**row.model_dump(exclude={"chapter"}), "building_id": building_id}
                for row in chunk_data
            ]
            stmt = (
                postgresql.insert(FormKS)
                .values(data_to_db)
                .on_conflict_do_nothing(
                    index_elements=[
                        "visr_identifier",
                        "local_num",
                        "total_cost",
                    ]
                )
            )
            await session.execute(stmt)
            await session.commit()

    # !!! При проверка существующиз данных игнорируются столбцы с NULL т.к. NULL != NULL так и не решил эту пролему

    return len(data_to_db)
