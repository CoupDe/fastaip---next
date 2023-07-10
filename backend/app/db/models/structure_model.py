from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .building_model import Building
from .modelBase import CommonAbstractBase


class Structure(CommonAbstractBase):
    __tablename__ = "structure_table"
    # id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    code_structure: Mapped[str] = mapped_column(String(100), unique=True)
    # building_id: Mapped[int] = mapped_column(ForeignKey("building_table.id"))
    buildings: Mapped[List["Building"]] = relationship(
        back_populates="structure", cascade="save-update, merge, delete"
    )

    def __repr__(self) -> str:
        return f"Structure(name={self.name!r}, code_building={self.code_structure!r})"
