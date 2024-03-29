from pydantic import (
    BaseModel,
    AfterValidator,
    constr,
    computed_field,
    ConfigDict,
    TypeAdapter,
    field_validator,
)

from typing_extensions import Annotated, Any

from schemas.visr_schema import VisrSchema


def check_range_chapter(chapter_num: int) -> int:
    if 1 <= chapter_num and chapter_num > 12:
      
        raise ValueError("Глава должна быть в диапазоне 1-12")
    return chapter_num


def check_loc_num(local_num: str) -> str:
    if len(local_num.split("-")) <= 1:
        raise ValueError(f"{local_num} не соответсвует формату сметы")
    return local_num.replace("\n", "").replace(";", "")


# Можно перечислять несколько валидаторов
LocalNum = Annotated[constr(strip_whitespace=True, to_lower=True), AfterValidator(check_loc_num)]  # type: ignore[valid-type]
Chapter = Annotated[int, AfterValidator(check_range_chapter)]
taChapter = TypeAdapter(Chapter)


class FormKS(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    visr_identifier: constr(strip_whitespace=True) | None  # type: ignore[valid-type]
    building_code: constr(strip_whitespace=True) | None  # type: ignore[valid-type]
    blueprint_project_number: constr(strip_whitespace=True) | None  # type: ignore[valid-type]
    local_num: LocalNum | None = None  # type: ignore[valid-type]

    # chapter: Optional[conint(ge=1, le=12)]  # type: ignore[valid-type]
    type_work: str
    unit: constr(strip_whitespace=True, to_lower=True) | None  # type: ignore[valid-type]
    quantity: float | None
    unit_cost: float | None
    total_cost: float | None

    @field_validator("unit")
    @classmethod
    def remove_space(cls, val: str) -> str | None:
        return val.replace(" ", "") if val else val

    @field_validator("unit_cost", "quantity", "total_cost")
    @classmethod
    def remove_zero(cls, num: float) -> float | None:
        """Убрать нули

        Args:
            num (float | None): _description_

        Returns:
            float | None: _description_
        """
        return num if num and num != 0 else None

    @computed_field
    def chapter(self) -> int | None:
        if self.local_num:
            try:
                num = str(self.local_num).split("-")[0]
                if num.isdigit():
                    return taChapter.validate_python(int(num))
                else:
                    return None
            except Exception as exc:
                print(exc)
        return None


class MyInfoError(BaseModel):
    index: int
    errorObj: list[dict]
    row_data: list[Any]


class FormKsWithId(FormKS):
    id: int
    visr_id: int | None
