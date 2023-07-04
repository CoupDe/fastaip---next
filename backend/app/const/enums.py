from enum import Enum

ESTIMATED_PRICE = {0: int, 1: str, 2: str, 3: str, 4: float, 5: float, 6: float}


class LaborEnum(Enum):
    OZ = "OZ"
    MM = "MM"
    AM = "AM"
    MA = "MA"


class AdditionalEstimatedEnum(Enum):
    NR = "NR"
    SP = "SP"


class VisrDataEnum(Enum):
    L = "L"
    E = "E"
    T = "T"
    LABOR = LaborEnum
    ADDITIONAL = AdditionalEstimatedEnum
