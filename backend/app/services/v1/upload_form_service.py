import time
from numpy import NaN
from pandas import DataFrame
from pydantic import ValidationError
import numpy as np
from schemas import formKs_shcema

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

    for row in pure_df.itertuples():
        try:
            new_obj = formKs_shcema.FromKS(**row._asdict())

        except ValidationError as e:
            if e.errors()[0]["loc"] == ("unit",):
                pass

    return pure_df
