from enum import Enum


ESTIMATED_PRICE = {0: int, 1: str, 2: str,
                   3: str, 4: float, 5: float, 6: float}


class LaborEnum(Enum):
    human_labor = 'ОЗ'
    machine_labor = 'ЭМ'
    material = 'МР'


class VisrDataEnum(Enum):
    estimated_price = 'E'
    labor_price = LaborEnum
    local_number = "L"
    
