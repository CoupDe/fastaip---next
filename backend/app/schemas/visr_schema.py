from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional
from fastapi import HTTPException

from pandas import DataFrame
import pandas as pd
from pydantic import ConfigDict, BaseModel, computed_field, field_validator, validator
from db.models.visr_models import (
    VisrModel,
    EstimateModel,
    EstimatedPriceModel,
    AdditionalPriceModel,
    LaborPriceModel,
)


from const.enums import LaborEnum, VisrDataEnum, AdditionalEstimatedEnum


# Abstract class Visr
class AbstractVisr(ABC, BaseModel):
    @abstractmethod
    def get_estimates_ranges(self, criteria: tuple[Enum, Enum]) -> list[range]:
        pass


# Abstract class Estimate
class AbstractEstimate(ABC, BaseModel):
    @abstractmethod
    def get_estimated_price_ranges(
        self, criteria: tuple[Enum, Enum], estimated_range: range
    ) -> list[DataFrame]:
        pass

    @abstractmethod
    def get_numbers(self, uniq_data: str) -> list[str]:
        pass


# class AbstractEstimate(ABC, BaseModel):
#     pos: int | None
#     name: str
#     unit: str
#     quantity: float
#     unit_cost: float
#     total_cost: float


# Abstract class LaborPrice, EstimatedPrice


class PriceComponent(ABC, BaseModel):
    pos: int
    code: str
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


class AdditionalPrice(BaseModel):
    pos: int
    name: AdditionalEstimatedEnum
    total_cost: float
    model_config = ConfigDict(arbitrary_types_allowed=True)


# Класс трудозатрат
class LaborPrice(PriceComponent):
    category: str
    temp: LaborEnum | AdditionalEstimatedEnum

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __str__(self) -> str:
        return f"{self.code}#{self.total_cost}"


# Класс рассценки
class EstimatedPrice(PriceComponent):
    labors: list[LaborPrice] = []
    additional_prices: list[AdditionalPrice] = []
    labor_df: DataFrame = DataFrame()

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.create_labor_price()

    def __str__(self) -> str:
        return f"{self.pos}#{self.name}"

    def create_labor_price(self):
        self.labor_df.index
        for row in self.labor_df.itertuples():
            data = row._asdict()
            data["category"] = data["pos"]
            data["pos"] = data["Index"]
            data.pop("Index")
            match data["temp"]:
                case AdditionalEstimatedEnum.NR.value:
                    self.additional_prices.append(
                        AdditionalPrice(
                            pos=data["pos"],
                            name=AdditionalEstimatedEnum.NR,
                            total_cost=data["total_cost"],
                        )
                    )
                case AdditionalEstimatedEnum.SP.value:
                    self.additional_prices.append(
                        AdditionalPrice(
                            pos=data["pos"],
                            name=AdditionalEstimatedEnum.SP,
                            total_cost=data["total_cost"],
                        )
                    )
                case _:
                    self.labors.append(LaborPrice(**data))

        # self.labors.append(LaborPrice(self.labor_df))

    def _data_to_db(self) -> EstimatedPriceModel:
        new_estimated_price = EstimatedPriceModel(
            pos=self.pos,
            code=self.code,
            name=self.name,
            unit=self.unit,
            quantity=self.quantity,
            unit_cost=self.unit_cost,
            total_cost=self.total_cost,
            labors=[
                LaborPriceModel(
                    category=labor.category,
                    **labor.model_dump(exclude={"temp", "category"}),
                )
                for labor in self.labors
            ],
            additional_prices=[
                AdditionalPriceModel(**additional_price.model_dump())
                for additional_price in self.additional_prices
            ],
        )

        return new_estimated_price


# Класс локальной сметы
class EstimateImpl(AbstractEstimate):
    estimate_price_criteria: VisrDataEnum = (
        VisrDataEnum.E.value,
        VisrDataEnum.ADDITIONAL.value.SP.value,
    )

    name_estimate: str = ""
    local_num: str | None = None
    machine_num: str = ""
    chapter: int | None = None
    estimated_prices: list[EstimatedPrice] = []
    estimate_error: list[dict[str, str]] = []
    estimate_df: DataFrame = pd.DataFrame()

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def __init__(
        self, name: str, local_num: str, machine_num: str, estimate_df: DataFrame
    ):
        super().__init__()
        self.name_estimate = name
        self.local_num = local_num
        self.machine_num = machine_num
        self.estimate_df = estimate_df
        self.chapter = self.set_chapter()

        # Метод для создания экземпляров расценок
        self.create_estimated_price()

    @staticmethod
    def get_local_num(uniq_data: str) -> list[str]:
        data = uniq_data.replace(" ", "").split("\n")
        if len(uniq_data) > 0:
            return data
        else:
            raise ValueError("Invalid uniq_data. Unable to extract local_num.")

    def __str__(self) -> str:
        return f"{self.local_num}#{self.machine_num}"

    def set_chapter(self) -> int | None:
        """Функция для получения главы из номера ЛС (self.local_num)

        Raises:
            HTTPException: необрабатываемое значение номера локальной сметы

        Returns:
            int | None: номер главы
        """
        if self.local_num is not None:
            try:
                num = int(self.local_num.split("-")[0].replace("0", ""))

            except ValueError:
                self.estimate_error.append(
                    {self.local_num: "Невозможно получить главу из локального номера"}
                )
                return None
            if not (1 <= num <= 12):
                self.estimate_error.append(
                    {
                        self.local_num: f"Нумерация глав 1-12 в вашем случае номер главы='{num}'"
                    }
                )

        return num

    def get_numbers(self, uniq_data: str) -> list[str]:
        """Обработка строки дл извлечения машинного номера/локального номера
            убирает пробелы
        Args:
            uniq_data (str): строка с разделителем /n
        """

        return uniq_data.replace(" ", "").split("\n")

    def get_estimated_price_ranges(
        self, criteria: tuple[Enum, Enum], estimated_range: range
    ) -> list[DataFrame]:
        """Функция для фильтрации диапазонов расценок

        Args:
            criteria (tuple[VisrDataEnum]): enum с критериями поиска (E-SP)

            estimated_ranges (list[range]): Диапазоны локальных смет

        Returns:
            list[DataFrame]: список DF расценок
        """

        query_result = self.estimate_df.loc[list(estimated_range)].query(
            f"temp in {criteria}"
        )
        start_index_estimate_price = query_result.index.array[::2]
        end_index_estimate_price = list(
            map(lambda x: x + 1, query_result.index.array[1::2])
        )
        return [
            self.estimate_df.loc[list(range(a, b))]
            for a, b in zip(start_index_estimate_price, end_index_estimate_price)
        ]

    def create_estimated_price(self):
        """Создание объектов расценок"""
        price_range = range(self.estimate_df.index[0], self.estimate_df.index[-1])

        estimated_prices_range = self.get_estimated_price_ranges(
            self.estimate_price_criteria, price_range
        )
        for price in estimated_prices_range:
            # Сброс индекса для сохранения порядка трудозатрат
            labor_df = price.iloc[1 : self.estimate_df.index[-1]].reset_index(drop=True)

            # Исключить крайнюю колонку temp
            estimate_price_data = {**price.iloc[0, :-1].to_dict(), "labor_df": labor_df}

            self.estimated_prices.append(EstimatedPrice(**estimate_price_data))

    def _data_to_db(self) -> EstimateModel:
        new_estimate = EstimateModel(
            name_estimate=self.name_estimate,
            local_num=self.local_num,
            machine_num=self.machine_num,
            chapter=self.chapter,
            estimated_prices=[
                estimated_price._data_to_db()
                for estimated_price in self.estimated_prices
            ],
        )
        return new_estimate


class VisrImpl(AbstractVisr):
    """Класс для создания Dataframe, сбор данных стоимостных состовляющих,
      объединение структуры в ВИСР преобразование данных для имопрта в БД

    Args:
        AbstractVisr (_type_): _description_

    Returns:
        _type_: _description_
    """

    #!!!!!!!!!!!!
    building_id: int | None = None
    estimate_price_criteria: tuple[Enum, Enum] = (
        VisrDataEnum.L.value,
        VisrDataEnum.T.value,
    )
    name_visr: str = ""
    type_work: str = ""
    total_cost: float = 0
    estimates: list[EstimateImpl] = []

    visr_df: DataFrame = DataFrame()

    def __init__(self, df: DataFrame) -> None:
        super().__init__()
        if df.at[0, "temp"] == "GN":
            self.name_visr = df.at[0, "pos"]
        if df.at[1, "temp"] == "GW":
            self.type_work = df.at[1, "pos"]
        self.total_cost = float(df.at[df.index[-1], "total_cost"])

        self.visr_df = df

    @computed_field  # type: ignore[misc]
    @property
    def visr_id(self) -> str | None:
        visr_id = self.name_visr.split(None, 1)[0]
        if visr_id[0].isdigit() and visr_id.count(".") > 1:
            return visr_id
        else:
            return None
        # for visr in self.visrs_df:
        #     for sheets_name, df in visr.items():
        #         visr_id = sheets_name.split(None, 1)[0]  # Получение id
        #         if visr_id[0].isdigit() and visr_id.count(".") > 1:
        #             visr_with_id.append({visr_id: df})
        #         else:
        #             visr_without_id.append(df)
        # return visr_with_id, visr_without_id

    def __str__(self) -> str:
        return f"{self.name_visr} {self.type_work}"

    def get_estimates_ranges(self, criteria: tuple[Enum, Enum]) -> list[range]:
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

    def merging_structure(self) -> None:
        """Функция подготовки данных к созданию классов из структуры локальных
        смет:расценок"""
        # Интересно как правильнее передавать данные в виде DF или Range
        # Получение диапазона ЛС в ВИСР
        estimated_ranges = self.get_estimates_ranges(self.estimate_price_criteria)

        # Получение DF расценки (E) в ЛС
        for estimate in estimated_ranges:
            # Получение строки со данными из сметы
            estimate_row = self.visr_df.loc[estimate[0], :]
            uniq_data, name = estimate_row[["code", "name"]]
            local_num, machine_num = EstimateImpl.get_local_num(
                uniq_data=str(uniq_data)
            )

            self.estimates.append(
                EstimateImpl(
                    str(name), local_num, machine_num, self.visr_df.loc[list(estimate)]
                )
            )

    def _data_to_db(self) -> VisrModel:
        """Преобразование данных для импорта в БД

        Returns:
            VisrModel: SQLAlchemy Model
        """
        transform_visr = VisrModel(
            building_id=VisrImpl.building_id,
            name_visr=self.name_visr,
            visrs_id=self.visr_id,
            type_work=self.type_work,
            total_cost=self.total_cost,
            estimates=[estimates._data_to_db() for estimates in self.estimates],
        )
        return transform_visr

    model_config = ConfigDict(arbitrary_types_allowed=True)


# post Model route.post("/{building_id}", response_model=ImportDataInfo)
class ImportDataInfo(BaseModel):
    """

    Args:
        BaseModel (_type_): _description_
    """

    filesInfo: list[tuple[str, int]] | str
    detail: str
    tempFileId: str
    confirmation: bool


# post Model route.post("/{building_id}/confirm/",
class ConfirmImport(BaseModel):
    redis_key_id: str | None = None
    redis_key_non_id: str | None = None
    tasks_key: str | None = None
    confirmation: bool
    id: int

    @computed_field  # type: ignore[misc]
    @property
    def file_paths(self) -> list[str]:
        temp_list: list[str] = []
        if self.redis_key_id:
            temp_list.append(self.redis_key_id)
        if self.redis_key_non_id:
            temp_list.append(self.redis_key_non_id)
        return temp_list


# return Model route.post("/{building_id}/confirm/"


class AdditionalPriceSchema(BaseModel):
    id: int
    pos: int
    name: AdditionalEstimatedEnum
    total_cost: float
    model_config = ConfigDict(arbitrary_types_allowed=True)


class LaborPriceSchema(PriceComponent):
    id: int
    category: LaborEnum
    model_config = ConfigDict(arbitrary_types_allowed=True)


class EsimatedPriceSchema(PriceComponent):
    id: int
    labors: list[LaborPriceSchema]
    additional_prices: list[AdditionalPriceSchema]
    model_config = ConfigDict(arbitrary_types_allowed=True)


class EstimateSchema(BaseModel):
    id: int
    name_estimate: str
    local_num: str | None = None
    machine_num: str
    chapter: int | None = None

    estimated_prices: list[EsimatedPriceSchema]
    model_config = ConfigDict(arbitrary_types_allowed=True)


class VisrBaseSchema(BaseModel):
    name_visr: str
    type_work: str
    total_cost: float
    visrs_id: str | None = None


class VisrSchema(VisrBaseSchema):
    building_id: int
    id: int
    estimates: list[EstimateSchema]
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
