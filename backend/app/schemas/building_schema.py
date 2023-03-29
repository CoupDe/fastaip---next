from pydantic import BaseModel


class BuildingBase(BaseModel):
    name: str
    code_building: str


class CreateBuilding(BuildingBase):
    pass


class Building(BuildingBase):
    id: int
    name: str
    code_building: str

    class Config:
        orm_mode = True
