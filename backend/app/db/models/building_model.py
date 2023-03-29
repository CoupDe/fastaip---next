

from ctypes import Structure
from sqlalchemy import Enum, ForeignKey
from typing import List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .modelBase import ModelBase
from .const import INVESTOR


class Building(ModelBase):
    __tablename__ = "building_table"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    code_building: Mapped[str] = mapped_column(String(100), unique=True)
    investor: Mapped[enumerate] = mapped_column(
        Enum(INVESTOR), name='investor', nullable=True)
    structure_id: Mapped[int] = mapped_column(ForeignKey("structure_table.id"))
    structure: Mapped["Structure"] = relationship(back_populates="buildings")

    def __repr__(self) -> str:
        return f"Building(name={self.name!r}, code_building={self.code_building!r})"
