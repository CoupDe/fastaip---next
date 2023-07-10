from abc import ABC, abstractmethod
from fastapi import HTTPException

from pandas import DataFrame
import pandas as pd
from pydantic import BaseModel


from const.enums import LaborEnum, VisrDataEnum, AdditionalEstimatedEnum


# Abstract class Visr
class Visr(ABC, BaseModel):
    @abstractmethod
    def get_estimates_ranges(self, criteria: tuple[str, str]) -> list[range]:
        pass


# Abstract class Estimate
class Estimate(ABC, BaseModel):
    @abstractmethod
    def get_estimated_price_ranges(
        self, criteria: tuple[str, str], estimated_range: range
    ) -> list[DataFrame]:
        pass

    @abstractmethod
    def get_numbers(self, uniq_data: str) -> list[str]:
        pass


class AbstractEstimate(ABC, BaseModel):
    pos: int | None
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


# Abstract class LaborPrice, EstimatedPrice


class PriceComponent(ABC, BaseModel):
    pos: int
    code: str
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


# Класс накладных расходов
class AdditionalPrice(BaseModel):
    pos_nr: int | None = None
    pos_sp: int | None = None
    overhead_name: str | None = None
    overhead_price: float | None = None
    profit_name: str | None = None
    profit_price: float | None = None

    @staticmethod
    def set_NR(pos_nr, overhead_name, overhead_price) -> "AdditionalPrice":
        additional_price = AdditionalPrice()
        additional_price.pos_nr = pos_nr
        additional_price.overhead_name = overhead_name
        additional_price.overhead_price = overhead_price
        return additional_price

    @staticmethod
    def set_SP(pos_sp, profit_name, profit_price) -> "AdditionalPrice":
        additional_price = AdditionalPrice()
        additional_price.pos_sp = pos_sp
        additional_price.profit_name = profit_name
        additional_price.profit_price = profit_price
        return additional_price


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
    labor_df: DataFrame = pd.DataFrame()

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
                case "NR":
                    self.additional_prices.append(
                        AdditionalPrice.set_NR(
                            data["pos"], data["name"], data["total_cost"]
                        )
                    )
                case "SP":
                    self.additional_prices.append(
                        AdditionalPrice.set_SP(
                            data["pos"], data["name"], data["total_cost"]
                        )
                    )
                case _:
                    self.labors.append(LaborPrice(**data))

        # self.labors.append(LaborPrice(self.labor_df))

    class Config:
        arbitrary_types_allowed = True


# Класс локальной сметы
class EstimateImpl(Estimate):
    estimate_price_criteria = (
        VisrDataEnum.E.value,
        VisrDataEnum.ADDITIONAL.value.SP.value,
    )

    name: str = ""
    local_num: str | None
    machine_num: str = ""
    chapter: int | None = None
    estimated_prices: list[EstimatedPrice] = []
    estimate_error: list[dict[str, str]] = []
    estimate_df: DataFrame = pd.DataFrame()

    def __init__(
        self, name: str, local_num: str, machine_num: str, estimate_df: DataFrame
    ):
        super().__init__()
        self.name = name
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
        self, criteria: tuple[str, str], estimated_range: range
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

    class Config:
        arbitrary_types_allowed = True


class VisrImpl(Visr):
    estimate_price_criteria = (VisrDataEnum.L.value, VisrDataEnum.T.value)
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

    def __str__(self) -> str:
        return f"{self.name_visr} {self.type_work}"

    def get_estimates_ranges(self, criteria: tuple[str, str]) -> list[range]:
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
        # print(self.estimates[0].estimated_prices[3].labors)

    class Config:
        arbitrary_types_allowed = True


# post Model route.post("/{building_id}", response_model=ImportDataInfo)
class ImportDataInfo(BaseModel):
    """aaaa

    Args:
        BaseModel (_type_): _description_
    """

    filesInfo: list[tuple[str, int]] | str
    detail: str
    tempFileId: str
    confirmation: bool


# post Model route.post("/{building_id}/confirm/",
class ConfirmImport(BaseModel):
    tempFileId: str
    confirmation: bool


# return Model route.post("/{building_id}/confirm/"
class EstimateResponse(BaseModel):
    name: str
    local_num: str | None
    machine_num: str
    chapter: int | None = None

    class Config:
        orm_mode = True


class VisrSchema(BaseModel):
    id: int
    name_visr: str
    type_work: str
    total_cost: float


class VisrDataDB(BaseModel):
    building_id: int | None = None
    name_visr: str
    type_work: str
    total_cost: float
    estimates: list[EstimateResponse]
