from pydantic import ConfigDict, BaseModel


class BuildingBase(BaseModel):
    name: str
    code_building: str


class CreateBuilding(BuildingBase):
    structure_id: int


class Building(BuildingBase):
    id: int
    name: str
    code_building: str
    model_config = ConfigDict(from_attributes=True)
