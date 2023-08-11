from pydantic import ConfigDict, BaseModel

from schemas.building_schema import Building


class StructureBase(BaseModel):
    name: str | None = None
    code_structure: str | None = None
    model_config = ConfigDict(from_attributes=True)


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
