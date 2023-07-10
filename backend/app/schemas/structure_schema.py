from pydantic import BaseModel

from schemas.building_schema import Building


class StructureBase(BaseModel):
    name: str | None = None
    code_structure: str | None = None

    class Config:
        orm_mode = True


class CreateStructure(StructureBase):
    pass


class UpdateStructure(StructureBase):
    name: str | None = None
    code_structure: str | None = None
    id: int


class Structure(StructureBase):
    id: int


class StructureBuilding(Structure):
    buildings: list[Building] | None = None
