from sqlalchemy import ForeignKey, String

from .building_model import Building
from .form_ks_model import FormKS
from const.enums import AdditionalEstimatedEnum, LaborEnum
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
    estimates: Mapped[list["EstimateModel"]] = relationship(
        back_populates="visr", cascade="all, delete"
    )
    visrs_id: Mapped[str] = mapped_column(String(300), nullable=True)
    formks: Mapped["FormKS"] = relationship(
        "FormKS", 
        back_populates="visr"
    )
    building_id: Mapped[int] = mapped_column(
        ForeignKey("buildings_table.id"), nullable=False
    )
    building: Mapped["Building"] = relationship(back_populates="visrs")

    def __repr__(self) -> str:
        return f"<Visr(name={self.name_visr!r}, type_work={self.type_work!r})"

    def __eq__(self, other: object) -> bool:
        if isinstance(other, VisrModel):
            return (
                self.name_visr == other.name_visr
                and self.type_work == other.type_work
                and self.total_cost == other.total_cost
                and self.building_id == other.building_id
            )

        return False


class EstimateModel(CommonAbstractBase):
    __tablename__ = "estimates_table"
    name_estimate: Mapped[str] = mapped_column(String(300))
    local_num: Mapped[str | None] = mapped_column(String(300), nullable=True)
    machine_num: Mapped[str] = mapped_column(String(300))
    chapter: Mapped[int | None] = mapped_column(nullable=True)
    visr_id: Mapped[int] = mapped_column(ForeignKey("visrs_table.id"), nullable=False)
    visr: Mapped["VisrModel"] = relationship(back_populates="estimates")
    estimated_prices: Mapped[list["EstimatedPriceModel"]] = relationship(
        back_populates="estimate", cascade="all, delete"
    )

    def __repr__(self) -> str:
        return f"<Estimate(name={self.name_estimate!r}, type_work={self.local_num!r})"


class EstimatedPriceModel(AbstractPriceComponent):
    __tablename__ = "estimated_prices_table"
    labors: Mapped[list["LaborPriceModel"]] = relationship(
        back_populates="estimated_price", cascade="all, delete"
    )
    additional_prices: Mapped[list["AdditionalPriceModel"]] = relationship(
        back_populates="estimated_price", cascade="all, delete"
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
        postgresql.ENUM(LaborEnum, name="LABORENUM", create_type=True),
        nullable=True,
    )
    estimated_price_id: Mapped[int] = mapped_column(
        ForeignKey("estimated_prices_table.id"), nullable=False
    )
    estimated_price: Mapped["EstimatedPriceModel"] = relationship(
        back_populates="labors"
    )

    def __init__(self, category, **kwargs):
        super().__init__(**kwargs)

        match category:
            case "ОЗ":
                self.category = LaborEnum.OZ
            case "ЗМ":
                self.category = LaborEnum.MM
            case "ЭМ":
                self.category = LaborEnum.AM
            case "МР":
                self.category = LaborEnum.MA

    def __repr__(self) -> str:
        return f"<LaborPriceModel(name={self.name!r}, code={self.code!r},category={self.category!r})"


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
