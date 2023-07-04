from abc import ABC

from pandas import DataFrame
import pandas as pd
from pydantic import BaseModel

from const.enums import LaborEnum, VisrDataEnum


class ImportDataInfo(BaseModel):
    """aaaa

    Args:
        BaseModel (_type_): _description_
    """

    filesInfo: list[tuple[str, int]] | str
    detail: str
    tempFileId: str
    confirmation: bool


class ConfirmImport(BaseModel):
    tempFileId: str
    confirmation: bool


class AbstractEstimate(ABC, BaseModel):
    pos: int | None
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


class LaborPrice(BaseModel):
    category: LaborEnum
    code: str
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


# Класс рассценки


class EstimatedPrice(BaseModel):
    pos: int
    code: str
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float
    labors: list[LaborPrice] = []
    _local_num: str | None
    _uniq_num: str | None


class Estimate(BaseModel):
    name: str = ""
    local_num: str = ""
    machine_num: str = ""
    estimated_prices: list[EstimatedPrice] = []
    estimate_df: DataFrame = pd.DataFrame()

    def __init__(self, name: str, uniq_data: str, estimate_df: DataFrame):
        super().__init__()

        self.name = name
        self.local_num, self.machine_num = self.get_numbers(uniq_data)
        self.estimate_df = estimate_df

    def __str__(self):
        return f"{self.local_num}#{self.machine_num}"

    def get_numbers(self, uniq_data: str):
        """Обработка строки дл извлечения машинного номера/локального номера
            убирает пробелы
        Args:
            uniq_data (str): строка с разделителем /n
        """

        return uniq_data.replace(" ", "").split("\n")
        # Класс трудозатрат

    class Config:
        arbitrary_types_allowed = True


class Visr(BaseModel):
    name_visr: str = ""
    type_work: str = ""
    total_price: float = 0
    estimates: list[Estimate] = []

    visr_df: DataFrame = DataFrame()

    def __init__(self, df: DataFrame) -> None:
        super().__init__()
        if df.at[0, "temp"] == "GN":
            self.name_visr = df.at[0, "pos"]
        if df.at[1, "temp"] == "GW":
            self.type_work = df.at[1, "pos"]
        self.total_price = df.at[df.index[-1], "total_cost"]
        self.visr_df = df

    def __str__(self) -> str:
        return f"{self.name_visr} {self.type_work}"

    def get_estimated_ranges(self, criteria: tuple[str, str]) -> list[range]:
        """Функция осуществляет фильтрацию диапазонов локальных смет,
        и спользуя переданные критерии

        Args:
            criteria (tuple[VisrDataEnum]): enum с критериями поиска (L-L,L-T)

        Returns:
            list[range]: Диапазон локальных смет
        """
        query = self.visr_df.query("temp in @criteria")
        start_index_estimate_price = query.index.array[::2]
        end_index_estimate_price = list(map(lambda x: x + 1, query.index.array[1::2]))
        return [
            range(a, b)
            for a, b in zip(start_index_estimate_price, end_index_estimate_price)
        ]

    def get_estimate_price_df(
        self, criteria: tuple[str, str], estimated_ranges: list[tuple[int, int]]
    ) -> list[dict[int, list[DataFrame]]]:
        """Функция для фильтрации диапазонов расценок

        Args:
            criteria (tuple[VisrDataEnum]): enum с критериями поиска (E-SP)

            estimated_ranges (list[range]): Диапазоны локальных смет

        Returns:
            list[dict[int, list[range]]]: номер индекса локальной сметы : список диапазонов расценок
        """

        result = []
        for e_range in estimated_ranges:
            query_result = self.visr_df.loc[e_range[0]].query(f"temp in {criteria}")
            start_index_estimate_price = query_result.index.array[::2]
            end_index_estimate_price = list(
                map(lambda x: x + 1, query_result.index.array[1::2])
            )
            ranges = [
                self.visr_df.loc[list(range(a, b))]
                for a, b in zip(start_index_estimate_price, end_index_estimate_price)
            ]
            result.append({e_range[0]: ranges})
        return result

    def merging_structure(self) -> None:
        """Функция подготовки данных к созданию классов из структуры локальных
        смет:расценок"""
        # Интересно как правильнее передавать данные в виде DF или Range
        # Получение диапазона ЛС в ВИСР
        estimated_ranges = self.get_estimated_ranges(
            (VisrDataEnum.T.value, VisrDataEnum.L.value)
        )

        # Получение DF расценки (E) в ЛС
        print("estimated_ranges", estimated_ranges)
        for estimate in estimated_ranges:
            estimate_row = self.visr_df.loc[estimate[0], :]
            uniq_data, name = estimate_row[["code", "name"]]
            # uniq_data, name = estimate_row["code", "name"]
            print("uniq_data, name ", uniq_data, name)
            self.estimates.append(
                Estimate(str(name), str(uniq_data), self.visr_df.loc[list(estimate)])
            )
        print("self.estimates", self.estimates)

    class Config:
        arbitrary_types_allowed = True


# @property
# def name_visr(self):
#     return self._name_visr

# @name_visr.setter
# def name_visr(self, value: str):
#     self._name_visr = value

# @property
# def type_work(self):
#     return self.type_work

# @type_work.setter
# def type_work(self, value: str):
#     self._type_work = value
