from abc import ABC, abstractmethod

import pandas as pd
from fastapi import HTTPException
from pandas import DataFrame
from pydantic import BaseModel

from const.enums import AdditionalEstimatedEnum, LaborEnum, VisrDataEnum


class EstimateInterface(ABC):
    @abstractmethod
    def set_estimated_price(self):
        pass

    @abstractmethod
    def set_local_estimate(self):
        pass

    @abstractmethod
    def set_labor_price(self, dt: DataFrame) -> DataFrame:
        pass


class PreparingVisr(BaseModel, EstimateInterface):
    """
    Класс получает готовый DataFrame проставляет колонки и проставляет признаки
    для дальнейшего создания моделей из DF
    ARGS:
      data(Pandas.Dataframe)
    """

    data: DataFrame = DataFrame()

    def __init__(self, dt: DataFrame):
        super().__init__()
        self.data = dt

    class Config:
        arbitrary_types_allowed = True

    @property
    def get_estimate(self) -> DataFrame:
        return self.data

    def set_field_category(self):
        self.data.update(self.set_header())
        self.data.update(self.set_estimated_price())
        self.data.update(self.set_local_estimate())
        self.data.update(self.set_labor_price())
        self.data.update(self.set_additional_estimated())
        self.set_total_estimate_cost()
        self.set_general_data()
        self.data = self.get_final_format()

    def set_header(self) -> None:
        """Установка фиксированных наименований
        колонок и добавление колонки temp"""

        try:
            self.data.columns = pd.Index(
                [
                    "pos",
                    "code",
                    "name",
                    "unit",
                    "quantity",
                    "unit_cost",
                    "total_cost",
                ]
            )
            self.data = self.data.assign(temp=None)
            # Удаление пробелов
            self.data.loc[:, "unit":"total_cost"] = self.data.loc[
                :, "unit":"total_cost"
            ].replace(r"\s+", "", regex=True)

        except ValueError:
            raise HTTPException(
                status_code=422,
                detail=f"""Количество колонок не соответсвует
                  требуемому формату, должно быть
                  7 колонок, присутвует {self.data.shape[1]}""",
            )

    def set_estimated_price(self) -> DataFrame:
        """
        Функция определния типа расценки и приведения позиции расценок к типу int16 тип 'E'
        """
        # to_numeric пробует конвертировать любые значения во float,
        # что не получается, конвертирует в NaN

        _temp_dt = self.data.loc[:, "pos":"total_cost"]
        convert_toFloat = pd.to_numeric(
            _temp_dt["pos"], errors="coerce", downcast="integer"
        )
        # Исключить шапку из возможного типа расценки 'E'

        _head_index = convert_toFloat.first_valid_index()
        if _temp_dt.loc[_head_index - 1, "pos":"quantity"].isna().all():
            convert_toFloat.loc[_head_index] = pd.NA
        # Создается условие для конвертации в float

        cond = convert_toFloat.notna()
        # Применяется конвертирование из float в int по условию

        _temp_dt.loc[cond, "pos"] = convert_toFloat[cond].astype("Int16")
        _temp_dt.loc[cond, "quantity":"total_cost"] = _temp_dt.loc[
            cond, "quantity":"total_cost"
        ].astype("Float64")
        _temp_dt.loc[cond, "temp"] = VisrDataEnum.E.value
        return _temp_dt

    def set_local_estimate(self) -> DataFrame:
        """
        Функция поиска и определения типа Номера сметы тип 'L'
        """
        # Поиск совпадения в подстроке и определение что колонка total_cost является nan
        _local_num_df = self.data.loc[
            self.data["code"].str.contains("\n", case=False, na=False)
            & (self.data["total_cost"].isna())
        ]

        try:
            # проверка на инстанс str и что последний символ не является переносом строки
            _local_num_df.loc[:, "temp"] = _local_num_df.loc[:, "code"].apply(
                lambda x: VisrDataEnum.L.value
                if (isinstance(x, str)) & (x[-1] != "\n")
                else None
            )
            local_number = _local_num_df.loc[:, ["code", "temp"]].query('temp == "L"')
            return local_number
        except:
            raise HTTPException(
                422,
                detail="вероятность ошибки в случае пустого массива Блок set_local_estimate",
            )

    def set_labor_price(self) -> DataFrame:
        """
        Функция по поиску трудозатрат Тип 'OZ MM AM MA' и приведение к типу float64
        стоимостных показателей
        """
        _temp_df = DataFrame()
        for labor_type in LaborEnum:
            tzo_df = self.data.loc[:].query("pos == @labor_type.value")
            tzo_df.loc[:, "quantity":"total_cost"] = tzo_df.loc[
                :, "quantity":"total_cost"
            ].astype("Float64")
            tzo_df["temp"] = labor_type.name
            _temp_df = pd.concat([_temp_df, tzo_df])

        return _temp_df

    def set_additional_estimated(self) -> DataFrame:
        """
        Функция по поиску накладных расходов и сметной прибыли, а так-же приведение к типу float64
        стоимостных показателей
        """
        _temp_df = DataFrame()
        for additional_type in AdditionalEstimatedEnum:
            additional_df = self.data.query(
                "name.str.contains(@additional_type.value,na=False) & code.isnull()"
            )
            additional_df.loc[:, "total_cost"] = additional_df.loc[
                :, "total_cost"
            ].astype("Float64")
            additional_df.loc[:, "temp"] = additional_type.name
            _temp_df = pd.concat([_temp_df, additional_df])
            _temp_df["name"].str.replace(" ", "")
        return _temp_df

    def set_total_estimate_cost(self) -> None:
        """Проверка по критериям на итог стоимости по смете"""
        try:
            if ("итог" in self.data.iloc[-1]["name"].lower()) & (
                pd.isna(self.data.iloc[-1]["code"])
            ):
                self.data.loc[self.data.index[-1], "total_cost"] = float(
                    self.data.iloc[-1]["total_cost"]
                )
                self.data.loc[self.data.index[-1], "temp"] = "T"
        except:
            raise HTTPException(422, detail="Отловить строку итоговой стоимости")

    def set_general_data(self) -> None:
        """Устанавливает признак общей информаци о ВИСР (Наименование ВИСР "GN", Наименование вида работ "GW")"""

        if self.data.at[3, "pos"] != "":
            self.data.at[3, "temp"] = "GN"
        else:
            raise HTTPException(
                status_code=422, detail="Наименование объекта имеет пустое значение"
            )
        if self.data.at[4, "pos"] != "":
            self.data.at[4, "temp"] = "GW"
        else:
            raise HTTPException(
                status_code=422, detail="Наименование объекта имеет пустое значение"
            )

    def get_final_format(self) -> DataFrame:
        """Фильтраци по признакам из колонки temp и возвращение чистого dataframe"""
        final = self.data[self.data["temp"].notna()].reset_index(drop=True)
        return final
