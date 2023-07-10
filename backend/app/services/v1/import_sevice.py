import pandas as pd
from pandas import DataFrame
from sqlalchemy import insert, select
from db.models.visr_models import Visr
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.visr_schema import VisrImpl, VisrDataDB, VisrSchema


def get_visr_range(position_gn: list[int], last_row: int) -> list[range]:
    """
    :param position_gn: Принимает список из индексов строк начала ВИСР
    """
    # Создается список со смещением с использованием Slice
    ofset_position = position_gn[1:] + [last_row]

    return [range(start, end - 1) for start, end in zip(position_gn, ofset_position)]


def get_visr(temp_path_df: str) -> list[VisrImpl]:
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

    visrs: list[VisrImpl] = []
    for visr in visr_ranges:
        visr_slice: DataFrame = (df.loc[list(visr), :]).reset_index(drop=True)
        visr_instance = VisrImpl(visr_slice)
        visr_instance.merging_structure()
        visrs.append(visr_instance)
    return visrs


# !!!!!!!!!!!!!!!ДОБАВИТЬ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ ВИСР
async def check_visr(check_data: VisrDataDB, session: AsyncSession) -> Visr:
    print("check_data", check_data)
    query = select(Visr).where(
        Visr.building_id == check_data.building_id,
        Visr.name_visr == check_data.name_visr,
        Visr.type_work == check_data.type_work,
        Visr.total_cost == check_data.total_cost,
    )

    result = await session.execute(query)

    return result


async def create_visr(
    building_id: int, visr: VisrDataDB, session: AsyncSession
) -> VisrDataDB:
    """Добавление записи структы в таблицы

    Args:
        building_id (int): id объекта
        visr (VisrDataDB): класс ВИСР
        session (AsyncSession): _description_

    Returns:
        VisrResponse: _description_
    """
    visr.building_id = building_id
    print("visr", visr.estimates)
    await check_visr(visr, session)
    orm = Visr(**visr.dict())
    
    result = await session.execute(insert(Visr).values(**visr.dict()).returning(Visr))
    await session.commit()

    print(result)
