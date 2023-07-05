import pandas as pd
from pandas import DataFrame


from schemas.visr_schema import VisrImpl


def get_visr_range(position_gn: list[int], last_row: int) -> list[range]:
    """
    :param position_gn: Принимает список из индексов строк начала ВИСР
    """
    # Создается список со смещением с использованием Slice
    ofset_position = position_gn[1:] + [last_row]

    return [range(start, end - 1) for start, end in zip(position_gn, ofset_position)]


def filter_data(temp_path_df: str) -> None:
    """Сбор общих данных для ВИСР

    Args:
        temp_path_df (str): _description_
    """
    df = pd.read_csv(temp_path_df)
    # Привести тип индекса к int
    df = df.set_index(pd.Index(range(len(df))))

    general_data = df[df.loc[:, "temp"] == "GN"].index.to_list()
    last_row = df.shape[0] + 1

    # Создание списка диапазонов ВИСР

    visr_ranges = get_visr_range(general_data, last_row)
    ss: list[VisrImpl] = []
    for visr in visr_ranges:
        visr_slice: DataFrame = (df.loc[list(visr), :]).reset_index(drop=True)
        visr_instance = VisrImpl(visr_slice)
        ss.append(visr_instance)
    ss[0].merging_structure()
