from enum import Enum


ESTIMATED_PRICE = {0: int, 1: str, 2: str,
                   3: str, 4: float, 5: float, 6: float}


class LaborEnum(Enum):
    OZ = 'ОЗ'
    MM = 'ЗМ'
    AM = 'ЭМ'
    MA = 'МР'


class AdditionalEstimatedEnum(Enum):
    NR = "НР"
    SP = "СП"


class VisrDataEnum(Enum):
    estimated_price = 'E'
    local_number = "L"
    labor_price = LaborEnum
