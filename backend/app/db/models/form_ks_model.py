from sqlalchemy import ForeignKey, String


from db.models.modelBase import (
    CommonAbstractBase,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class FormKS(CommonAbstractBase):
    __tablename__ = "formks_table"
    visr_identifier: Mapped[str] = mapped_column(String(50))
    building_code: Mapped[str] = mapped_column(String(150))

    blueprint_project_number: Mapped[str] = mapped_column(String(150))
    local_num: Mapped[str | None] = mapped_column(String(300), nullable=True)

    type_work: Mapped[str] = mapped_column(String(300))
    unit: Mapped[str] = mapped_column(String(10))
    quantity: Mapped[float]
    unit_cost: Mapped[float]
    total_cost: Mapped[float]
    visr: Mapped["VisrModel"] = relationship(back_populates="formks")
    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings_table.id"), nullable=False
    )
    building: Mapped["Building"] = relationship(back_populates="formsks")

    def __repr__(self) -> str:
        return f"<FormKS(name={self.name_visr!r}, type_work={self.type_work!r})"
