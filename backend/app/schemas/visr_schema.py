
from pandas import DataFrame, Series
from pydantic import BaseModel, Field, ValidationError, confloat, conint, validator
from typing import Tuple
from const.pandas_template import LaborEnum


class ImportDataInfo(BaseModel):
    filesInfo: list[tuple[str, int]] | str
    detail: str
    tempFileId: str
    confirmation: bool


class ConfirmImport(BaseModel):
    tempFileId: str
    confirmation: bool


class LaborPrice(BaseModel):
    category: LaborEnum
    code: str
    name: str
    unit: str
    quantity: float
    unit_cost: float
    total_cost: float


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


class Visr(BaseModel):
    name_visr: str = ''
    type_work: str = ''
    pricing: list[EstimatedPrice] = []
    _visr_df: DataFrame

    @property
    def visr_df(self):
        return self._visr_df

    @visr_df.setter
    def visr_df(self, df: DataFrame):
        self._visr_df = df

    def __init__(self, df: DataFrame) -> None:
        super().__init__()

    class Config:
        arbitrary_types_allowed = True

    # @validator('_name_visr', '_type_work')
    # def only_space(cls, general_data):

    #     if general_data.isspace():
    #         raise HTTPException(
    #             status_code=422, detail=f"В строке содержатся только пробелы")
    #     return general_data
