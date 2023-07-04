import pandas as pd
from pandas import DataFrame

from schemas.visr_schema import Visr


def get_visr_range(position_gn: list[int], last_row: int) -> list[range]:
    """
    :param position_gn: Принимает список из индексов строк начала ВИСР
    """
    # Создается список со смещением с использованием Slice
    ofset_position = position_gn[1:] + [last_row]

    return [range(start, end - 1) for start, end in zip(position_gn, ofset_position)]


def filter_data(temp_path_df: str) -> None:
    df = pd.read_csv(temp_path_df)

    general_data = df[df.loc[:, "temp"] == "GN"].index.to_list()
    last_row = df.shape[0] + 1

    # Создание списка диапозонов ВИСР

    visr_ranges = get_visr_range(general_data, last_row)
    ss: list[Visr] = []
    for visr in visr_ranges:
        visr_slice: DataFrame = (df.loc[visr, :]).reset_index(drop=True)
        visr_instance = Visr(visr_slice)
        ss.append(visr_instance)
    ss[0].merging_structure()
