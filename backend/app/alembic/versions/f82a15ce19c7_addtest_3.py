"""addTest_3


Revision ID: f82a15ce19c7
Revises: da414172fd3f
Create Date: 2023-04-03 15:46:45.405601

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f82a15ce19c7'
down_revision = 'da414172fd3f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('building_table', sa.Column('testCol', sa.String(length=100), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('building_table', 'testCol')
    # ### end Alembic commands ###