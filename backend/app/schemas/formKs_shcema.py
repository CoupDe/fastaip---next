from pydantic import BaseModel


class FromKS(BaseModel):
    visr_identifier: str
    building_code: str | None
    blueprint_project_number: str | None
    local_num: str | None
    type_work: str
    unit: str | None
    quantity: float
    unit_cost: float
    total_cost: float
