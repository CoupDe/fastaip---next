"""rev

Revision ID: 00ec545a23c4
Revises: d9c10444b199
Create Date: 2023-04-03 14:55:47.987117

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "00ec545a23c4"
down_revision = "d9c10444b199"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "structure_table",
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("code_structure", sa.String(length=100), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code_structure"),
    )
    op.create_table(
        "building_table",
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("code_building", sa.String(length=100), nullable=False),
        sa.Column(
            "investor",
            postgresql.ENUM("GSP", "GINVEST", "GTOMSK", name="INVESTOR"),
            nullable=True,
        ),
        sa.Column("structure_id", sa.Integer(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["structure_id"],
            ["structure_table.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code_building"),
        sa.UniqueConstraint("name"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("building_table")
    op.drop_table("structure_table")
    # ### end Alembic commands ###
