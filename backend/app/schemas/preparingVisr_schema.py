from abc import ABC,  abstractmethod
from fastapi import HTTPException
from pandas import DataFrame, Series
from pydantic import BaseModel
import pandas as pd
from const.pandas_template import LaborEnum
from const.pandas_template import VisrDataEnum


class EstimateInterface(ABC):
    @abstractmethod
    def set_header(self):
        pass

    def set_field_category(self):
        pass

    def set_estimated_price(self, dt: DataFrame) -> DataFrame:
        pass


class PreparingVisr(BaseModel, EstimateInterface):
    """
    ARGS:
      data(Pandas.Dataframe)
    """
    data: DataFrame = None

    def __init__(self, dt: DataFrame):
        super().__init__()
        self.data = dt

    class Config:
        arbitrary_types_allowed = True

    def set_header(self) -> None:
        """Установка фиксированных наименований колонок и добавление колонки temp"""

        try:
            self.data.columns = ['pos', 'code', 'name', 'unit',
                                 'quantity', 'unit_cost', 'total_cost']
            self.data = self.data.assign(temp=None)
            # Удаление пробелов
            self.data.loc[:, 'unit': 'total_cost'] = self.data.loc[:, 'unit':
                                                                   'total_cost'].replace(r'\s+', '', regex=True)

        except ValueError as e:
            raise HTTPException(
                status_code=422, detail=f"Количество колонок не соответсвует требуемому формату, должно быть 7 колонок, присутвует {self.data.shape[1]}")

    def set_field_category(self):
        self.data.update(self.set_estimated_price())

        self.data.update(self.set_local_estimate())
        self.set_labor_price()
        # ss = data_evr[data_evr['temp'].notna()].index
        # pp = ss.map(lambda x: range(x-5, x))

    def set_estimated_price(self) -> DataFrame:
        """
        Функция определния типа расценки и приведения позиции расценок к типу int16 тип 'E'
        """
        # to_numeric пробует конвертировать любые значения во float,
        # что не получается, конвертирует в NaN
        dt = self.data.loc[:, ['pos']]
        convert_toFloat = pd.to_numeric(
            dt['pos'], errors='coerce', downcast='integer')
        # Создается условие для конвертации в float
        cond = convert_toFloat.notna()
        # Применяется конвертирование из float в int по условию
        dt.loc[cond, 'pos'] = convert_toFloat[cond].astype('Int16')
        dt.loc[cond, 'temp'] = VisrDataEnum.estimated_price.value

        return dt

    def set_local_estimate(self) -> DataFrame:
        """
        Функция поиска и определения типа Номера сметы тип 'L'
        """
        # Поиск совпадения в подстроке и определение что колонка total_cost является nan
        _local_num_df = self.data.loc[self.data['code'].str.contains(
            '\n', case=False, na=False) & (self.data['total_cost'].isna())]

        try:
            # проверка на инстанс str и что последний символ не является переносом строки
            _local_num_df.loc[:, 'temp'] = _local_num_df.loc[:, 'code'].apply(
                lambda x: VisrDataEnum.local_number.value if (isinstance(x, str)) & (x[-1] != '\n') else None)
            local_number = _local_num_df.loc[:, [
                'code', 'temp']].query('temp == "L"')
            return local_number
        except:
            raise HTTPException(
                422, detail='вероятность ошибки в случае пустого массива Блок set_local_estimate')

    def set_labor_price(self) -> DataFrame:
        """
        Функция по поиску трудозатрат Тип 'TZO TZEM TZM' и приведение к типу float64
        стоимостных показателей
        """
        tzo = LaborEnum.human_labor.value

        for labor_type in LaborEnum:
            tzo_df = self.data.loc[:].query(
                "pos == @labor_type.value")
            tzo_df['temp'] = labor_type.value
            tzo_df.update(
                tzo_df.loc[:, 'quantity': 'total_cost'].astype('Float64'))
            print(tzo_df)

        # tzo_df.update(
        #     tzo_df.loc[:, 'quantity': 'total_cost'].astype('Float64'))
        # print(tzo_df.head(50))
        # try:
        # ser = tzo_df.loc[:, 'quantity': 'total_cost'].astype("float64")
        # except:
        # print('aaa')
