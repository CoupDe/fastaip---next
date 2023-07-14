from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class ModelBase(DeclarativeBase):
    pass


class CommonAbstractBase(ModelBase):
    __abstract__ = True

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_onupdate=func.now(), nullable=True
    )


class AbstractEstimate(CommonAbstractBase):
    __abstract__ = True
    pos: Mapped[int | None] = mapped_column(nullable=True)
    name: Mapped[str] = mapped_column(String(300))
    unit: Mapped[str] = mapped_column(String(10))
    quantity: Mapped[float]
    unit_cost: Mapped[float]
    total_cost: Mapped[float]


class AbstractPriceComponent(AbstractEstimate):
    __abstract__ = True
    code: Mapped[str] = mapped_column(String(300),nullable=True)
