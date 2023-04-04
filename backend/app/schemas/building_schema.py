from pydantic import BaseModel


class BuildingBase(BaseModel):
    name: str
    code_building: str


class CreateBuilding(BuildingBase):
    structure_id: int


class Building(BuildingBase):
    id: int
    name: str
    code_building: str

    class Config:
        orm_mode = True
