from fastapi import HTTPException
from pandas import DataFrame, Series
from pydantic import BaseModel
import pandas as pd

from const.pandas_template import VisrDataEnum


class PreparingVisr(BaseModel):
    data: DataFrame

    def __init__(self, dt: DataFrame):
        super().__init__(data=dt)
        self.data = dt

    def set_header(self) -> None:
        """Установка фиксированных наименований колонок и добавление колонки temp"""

        try:
            self.data.columns = ['pos', 'code', 'name', 'unit',
                                 'quantity', 'unit_cost', 'total_cost']
            self.data = self.data.assign(temp=None)

        except ValueError as e:
            raise HTTPException(
                status_code=422, detail=f"Количество колонок не соответсвует требуемому формату, должно быть 7 колонок, присутвует {dt.shape[1]}")

    def set_field_category(self):

        print('aaaaaaaaaaaa\n', self.data['pos'])
        self.data = self._set_estimated_price(
            self.data.loc[:, ['pos']])
        print(type(self.data.at[19,'pos']))

        # ss = data_evr[data_evr['temp'].notna()].index
        # pp = ss.map(lambda x: range(x-5, x))

    def _set_estimated_price(self, dt: DataFrame) -> DataFrame:
        """"Функция определния типа расценки и приведения к типу int16"""
        # to_numeric пробует конвертировать любые значения во float,
        # что не получается, конвертирует в NaN

        print('dt\n', dt)
        convert_toFloat = pd.to_numeric(
            dt['pos'], errors='coerce', downcast='integer')
        # Создается условия для того что было конвертировано во float
        cond = convert_toFloat.notna()
        # Применяется конвертирование из float в int по условию
        dt.loc[cond, 'pos'] = convert_toFloat[cond].astype('Int16')
        dt.loc[cond, 'temp'] = VisrDataEnum.estimated_price.value

        return dt

    class Config:
        arbitrary_types_allowed = True
