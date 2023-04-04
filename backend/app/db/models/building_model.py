

from sqlalchemy import TIMESTAMP, DateTime, Enum, ForeignKey, func
import datetime
from typing import List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects import postgresql
from schemas.structure_schema import Structure
from .modelBase import CommonAbstractBase, ModelBase
from .const import INVESTOR


class Building(CommonAbstractBase):
    __tablename__ = "building_table"
    # id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    code_building: Mapped[str] = mapped_column(String(100), unique=True)
    investor: Mapped[postgresql.ENUM] = mapped_column(
        postgresql.ENUM(INVESTOR, name='INVESTOR', create_type=False),  nullable=True)
    structure_id: Mapped[int] = mapped_column(ForeignKey("structure_table.id"))
    structure: Mapped["Structure"] = relationship(back_populates="buildings")
    
    # updated_at = Mapped[DateTime] = mapped_column(
    # default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"Building(name={self.name!r}, code_building={self.code_building!r})"
