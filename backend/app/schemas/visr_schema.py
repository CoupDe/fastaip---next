
from pandas import Series
from pydantic import BaseModel, ValidationError, confloat, conint, validator
from typing import Tuple
from const.pandas_template import LaborEnum


class ImportDataInfo(BaseModel):
    filesInfo: list[tuple[str, int]] | str
    detail: str
    tempFilePath:str


class EstimatedPrice():
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


class Visr(BaseModel):
    name_visr: str
    type_work: str
    pricing: list[EstimatedPrice]

    class Config:
        arbitrary_types_allowed = True

    def __init__(self, general_series: Series) -> None:
        return super().__init_()

    # @validator('_name_visr', '_type_work')
    # def only_space(cls, general_data):

    #     if general_data.isspace():
    #         raise HTTPException(
    #             status_code=422, detail=f"В строке содержатся только пробелы")
    #     return general_data

    @property
    def set_chapter(self, dt: Series):

        print(dt)
