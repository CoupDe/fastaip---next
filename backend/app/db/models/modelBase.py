from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.declarative import AbstractConcreteBase
from sqlalchemy import TIMESTAMP, DateTime, func


class ModelBase(DeclarativeBase):
    pass


class CommonAbstractBase(ModelBase):
    __abstract__ = True
    
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_onupdate=func.now(), nullable=True)
