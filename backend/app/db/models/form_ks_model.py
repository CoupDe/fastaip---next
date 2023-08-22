from sqlalchemy import ForeignKey, String, UniqueConstraint

from db.models.modelBase import (
    CommonAbstractBase,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class FormKS(CommonAbstractBase):
    __table_args__ = (
        UniqueConstraint(
            "visr_identifier",
            "local_num",
            "total_cost",
        ),
    )
    __tablename__ = "formks_table"

    visr_identifier: Mapped[str] = mapped_column(String(50), nullable=False)
    building_code: Mapped[str | None] = mapped_column(String(150))

    blueprint_project_number: Mapped[str | None] = mapped_column(String(150))
    local_num: Mapped[str | None] = mapped_column(String(300))

    type_work: Mapped[str | None] = mapped_column(String(300))
    unit: Mapped[str | None] = mapped_column(String(10), nullable=True)
    quantity: Mapped[float | None] = mapped_column()
    unit_cost: Mapped[float | None] = mapped_column(nullable=True)
    total_cost: Mapped[float | None] = mapped_column(nullable=True)
    visr: Mapped["VisrModel"] = relationship(  # type: ignore [name-defined]
        back_populates="formks"
    )
    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings_table.id"), nullable=False
    )
    building: Mapped["Building"] = relationship(back_populates="formsks")  # type: ignore [name-defined]

    def __repr__(self) -> str:
        return f"<FormKS(name={self.local_num!r}, type_work={self.type_work!r})"
