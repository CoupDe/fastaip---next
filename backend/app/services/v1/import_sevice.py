import pandas as pd
from pandas import DataFrame
from sqlalchemy import insert, select
from db.models.visr_models import VisrModel, EstimateModel, EstimatedPriceModel
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.visr_schema import VisrImpl, VisrSchema, TestVisrSchema


def get_visr_range(position_gn: list[int], last_row: int) -> list[range]:
    """
    :param position_gn: Принимает список из индексов строк начала ВИСР
    """
    # Создается список со смещением с использованием Slice
    ofset_position = position_gn[1:] + [last_row]

    return [range(start, end - 1) for start, end in zip(position_gn, ofset_position)]


def get_visr(visrs_df: DataFrame, building_id: int) -> list[VisrImpl]:
    """Сбор общих данных для ВИСР

    Args:
        temp_path_df (str): _description_
    """

    # Привести тип индекса к int
    df = visrs_df.set_index(pd.Index(range(len(visrs_df))))

    general_data = df[df.loc[:, "temp"] == "GN"].index.to_list()
    last_row = df.shape[0] + 1

    # Создание списка диапазонов ВИСР

    visr_ranges = get_visr_range(general_data, last_row)
    VisrImpl.building_id = building_id
    visrs: list[VisrModel] = []
    for visr in visr_ranges:
        visr_slice: DataFrame = (df.loc[list(visr), :]).reset_index(drop=True)
        visr_instance = VisrImpl(visr_slice)
        visr_instance.merging_structure()
        visrs.append(visr_instance._data_to_db())
    return visrs


# !!!!!!!!!!!!!!!ДОБАВИТЬ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ ВИСР
async def check_visr_BD(
    check_data: list[VisrModel], building_id: int, session: AsyncSession
) -> VisrSchema:
    """Проверка на существование ВИСР-ов в бд, уходит одни SQL запрос

    Args:
        check_data (list[VisrSchema]): _description_
        session (AsyncSession): _description_

    Returns:
        VisrSchema: _description_
    """

    query = select(VisrModel).filter(
        VisrModel.name_visr.in_([visr.name_visr for visr in check_data]),
        VisrModel.total_cost.in_([visr.total_cost for visr in check_data]),
        VisrModel.type_work.in_([visr.type_work for visr in check_data]),
        VisrModel.building_id == building_id,
    )

    result = await session.execute(query)
    result_records = result.all()
    lutten_list1 = [result[0] for result in result_records]
    print("result[0][0]", lutten_list1[0], "type", type(lutten_list1[0]))
    print("check_data", check_data[0], "check_data", type(check_data[0]))
    ss = check_data[0]
    ss.building_id = 2

    print("ss", ss)
    print(lutten_list1[0] == ss)
    # Если совпадения по полям найдены, выпрямить список и исключить совпадения
    if result_records:
        list_to_eq = [
            TestVisrSchema(**obj.__dict__, building_id=building_id)
            for obj in check_data
        ]
        flutten_list = [
            TestVisrSchema.from_orm(result[0])
            for result in result_records
            if result_records
        ]

        non_existing_objects = [
            VisrModel(**obj.__dict__) for obj in list_to_eq if obj not in flutten_list
        ]

    # return result


async def create_visr(
    building_id: int, visr: VisrSchema, session: AsyncSession
) -> VisrSchema:
    """Добавление записи структы в таблицы

    Args:
        building_id (int): id объекта
        visr (VisrDataDB): класс ВИСР
        session (AsyncSession): _description_

    Returns:
        VisrResponse: _description_
    """
    visr.building_id = building_id

    session.add(visr)

    await session.commit()
