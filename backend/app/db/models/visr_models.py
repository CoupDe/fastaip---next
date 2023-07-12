from sqlalchemy import ForeignKey, String

from const.enums import AdditionalEstimatedEnum, LaborEnum
from schemas.building_schema import Building

from sqlalchemy.dialects import postgresql
from db.models.modelBase import (
    AbstractPriceComponent,
    CommonAbstractBase,
    AbstractEstimate,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class VisrModel(CommonAbstractBase):
    __tablename__ = "visrs_table"
    name_visr: Mapped[str] = mapped_column(String(300))
    type_work: Mapped[str] = mapped_column(String(300))
    total_cost: Mapped[float] = mapped_column()
    estimates: Mapped[list["EstimateModel"]] = relationship(back_populates="visr")
    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings_table.id"), nullable=False
    )
    building: Mapped["Building"] = relationship(back_populates="visrs")
    # estimates_prices: Mapped[list["EstimatedPrice"]] = relationship(
    # back_populates="visr"
    # )
    # laborprice: Mapped[list["LaborPrice"]] = relationship(back_populates="visr")
    # additionalprice: Mapped[list["AdditionalPrice"]] = relationship(
    # back_populates="visr"
    # )

    def __repr__(self) -> str:
        return f"<Visr(name={self.name_visr!r}, type_work={self.type_work!r})"


class EstimateModel(CommonAbstractBase):
    __tablename__ = "estimates_table"
    name_estimate: Mapped[str] = mapped_column(String(300))
    local_num: Mapped[str | None] = mapped_column(String(300), nullable=True)
    machine_num: Mapped[str] = mapped_column(String(300))
    chapter: Mapped[int | None] = mapped_column(nullable=True)
    visr_id: Mapped[int] = mapped_column(ForeignKey("visrs_table.id"), nullable=False)
    visr: Mapped["VisrModel"] = relationship(back_populates="estimates")
    estimated_prices: Mapped[list["EstimatedPriceModel"]] = relationship(
        back_populates="estimate"
    )

    def __repr__(self) -> str:
        return f"<Estimate(name={self.name_estimate!r}, type_work={self.local_num!r})"


class EstimatedPriceModel(AbstractPriceComponent):
    __tablename__ = "estimated_prices_table"
    labors: Mapped[list["LaborPriceModel"]] = relationship(
        back_populates="estimated_price"
    )
    additional_prices: Mapped[list["AdditionalPriceModel"]] = relationship(
        back_populates="estimated_price"
    )
    estimate: Mapped["EstimateModel"] = relationship(back_populates="estimated_prices")
    estimate_id: Mapped[int] = mapped_column(
        ForeignKey("estimates_table.id"), nullable=False
    )

    def __repr__(self) -> str:
        return f"<Estimated_price(name={self.name!r}, type_work={self.unit!r})"


class LaborPriceModel(AbstractPriceComponent):
    __tablename__ = "labor_prices_table"
    category: Mapped[postgresql.ENUM] = mapped_column(
        postgresql.ENUM(LaborEnum, name="LABORENUM", create_type=False),
        nullable=True,
    )
    estimated_price_id: Mapped[int] = mapped_column(
        ForeignKey("estimated_prices_table.id"), nullable=False
    )
    estimated_price: Mapped["EstimatedPriceModel"] = relationship(
        back_populates="labors"
    )


class AdditionalPriceModel(CommonAbstractBase):
    __tablename__ = "additional_prices_table"
    pos: Mapped[int]
    name: Mapped[postgresql.ENUM] = mapped_column(
        postgresql.ENUM(
            AdditionalEstimatedEnum, name="ADDITIONAL_PRICE", create_type=False
        ),
        nullable=True,
    )
    total_cost: Mapped[float]
    estimated_price_id: Mapped[int] = mapped_column(
        ForeignKey("estimated_prices_table.id"), nullable=False
    )
    estimated_price: Mapped["EstimatedPriceModel"] = relationship(
        back_populates="additional_prices"
    )

    def __repr__(self) -> str:
        return f"<AdditionalPriceModel(name={self.name!r}"
