from numpy import NaN
from pandas import DataFrame

from schemas import formKs_shcema

# Удаляет все строки где в колнке 'позиции по Виду и стоимости работ' пусто, так как не привяжется ВИСР


def get_for_data(df_excel: DataFrame) -> DataFrame:
    """Конвертация данных из EXCEL в DataFrame с исключением лишних колонок и строк с пустыми значениями кодировки ВИСР

    Args:
        df_excel (DataFrame): _description_

    Returns:
        DataFrame: чистый DF
    """
    pure_df = df_excel.iloc[:, 1:10]
    pure_df = pure_df.dropna(axis=0, subset=pure_df.columns[0]).reset_index(drop=True)
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
    )

    ss = pure_df.loc[9, :].to_dict()
    new_obj = formKs_shcema.FromKS(**ss)
    print(new_obj.dict())
    assert new_obj.local_num == new_obj.local_num
    print("new_obj", new_obj.local_num, new_obj.type_work)
    return pure_df
