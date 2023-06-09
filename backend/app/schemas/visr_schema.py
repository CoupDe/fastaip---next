
from enum import Enum
from typing import Tuple
from fastapi import HTTPException
from pandas import Series
from pydantic import BaseModel, ValidationError, confloat, conint, validator

from const.pandas_template import LaborEnum





class Visr(BaseModel):
    _name_visr: str
    _type_work: str
    _chapter: int | None

    # @validator('_name_visr', '_type_work')
    # def only_space(cls, general_data):

    #     if general_data.isspace():
    #         raise HTTPException(
    #             status_code=422, detail=f"В строке содержатся только пробелы")
    #     return general_data

    @property
    def set_chapter(self, dt: Series):

        print(dt)


class EstimatedPrice(Visr):
    pos = int
    code = str
    name = str
    unit = str
    quantity = float
    unit_cost = float
    total_cost = float
    _local_num: str | None
    _uniq_num: str | None


class LaborPrice(EstimatedPrice):
    category = LaborEnum
    code = str
    name = str
    unit = str
    quantity = float
    unit_cost = float
    total_cost = float



