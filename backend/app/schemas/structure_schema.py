from pydantic import BaseModel

from schemas.building_schema import Building


class StructureBase(BaseModel):
    name: str
    code_structure: str


class CreateStructure(StructureBase):
    pass


class Structure(StructureBase):
    id: int
    buildings: list[Building] | None = None
    class Config:
        orm_mode = True


class StructureBuilding(BaseModel):
    buildings: list[Building] | None = None
