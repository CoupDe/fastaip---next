from sqlalchemy import ForeignKey, String
from schemas.building_schema import Building


from db.models.modelBase import (
    AbstractPriceComponent,
    CommonAbstractBase,
    AbstractEstimate,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Visr(CommonAbstractBase):
    __tablename__ = "visr_table"
    name_visr: Mapped[str] = mapped_column(String(300))
    type_work: Mapped[str] = mapped_column(String(300))
    total_cost: Mapped[float] = mapped_column()
    estimates: Mapped[list["Estimate"]] = relationship(back_populates="visr")
    building_id: Mapped[int] = mapped_column(
        ForeignKey("building_table.id"), nullable=False
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


class Estimate(AbstractEstimate):
    __tablename__ = "estimate_table"
    visr_id: Mapped[int] = mapped_column(ForeignKey("visr_table.id"), nullable=False)
    visr: Mapped["Visr"] = relationship(back_populates="estimates")

    def __repr__(self) -> str:
        return f"<Visr(name={self.name_visr!r}, type_work={self.type_work!r})"


# class EstimatedPrice(AbstractEstimate):
#     __tablename__ = "estimate_price_table"
#     labors: Mapped[list["LaborPrice"]] = relationship(back_populates="estimatedprice")
#     additional_prices: Mapped[list["AdditionalPrice"]] = relationship(
#         back_populates="estimatedprice"
#     )
#     visr: Mapped["Visr"] = relationship(back_populates="estimates_prices")
#     visr_id: Mapped[int] = mapped_column(ForeignKey("visr_table.id"), nullable=False)


# class LaborPrice(AbstractPriceComponent):
#     estimatedprice_id: Mapped[int] = mapped_column(
#         ForeignKey("estimate_price_table.id"), nullable=False
#     )
#     estimatedprice: Mapped["EstimatedPrice"] = relationship(back_populates="labors")
#     visr_id: Mapped[int] = mapped_column(ForeignKey("visr_table.id"), nullable=False)
#     visr: Mapped["Visr"] = relationship(back_populates="laborprice")
#     __tablename__ = "laborprice_table"


# class AdditionalPrice(CommonAbstractBase):
#     __tablename__ = "additionalprice_table"
#     pos_nr: Mapped[int | None]
#     pos_sp: Mapped[int | None]
#     overhead_name: Mapped[str | None]
#     overhead_price: Mapped[float | None]
#     profit_name: Mapped[str | None]
#     profit_price: Mapped[float | None]
#     estimatedprice_id: Mapped[int] = mapped_column(
#         ForeignKey("estimate_price_table.id"), nullable=False
#     )
#     estimatedprice: Mapped["EstimatedPrice"] = relationship(back_populates="additional_prices")
#     visr_id: Mapped[int] = mapped_column(ForeignKey("visr_table.id"), nullable=False)
#     visr: Mapped["Visr"] = relationship(back_populates="additionalprice")
