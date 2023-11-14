from pydantic import BaseModel, ConfigDict
from schemas.visr_schema import VisrBaseSchema


from schemas.formKs_schema import FormKS


class FormKsSync(FormKS):
    model_config = ConfigDict(arbitrary_types_allowed=True, extra="allow")
    visr: VisrBaseSchema

class TestVisrBaseSchema(VisrBaseSchema):
    model_config = ConfigDict(
        extra="allow",
        from_attributes=True,
        arbitrary_types_allowed=True,
    )

class TestModel(FormKS):
    model_config = ConfigDict(
        extra="allow",
        from_attributes=True,
        arbitrary_types_allowed=True,
    )
    visr: TestVisrBaseSchema
