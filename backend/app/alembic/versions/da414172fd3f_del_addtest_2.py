"""del_addTest_2

Revision ID: da414172fd3f
Revises: 87d1fa8d8c1c
Create Date: 2023-04-03 15:46:05.107051

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'da414172fd3f'
down_revision = '87d1fa8d8c1c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('building_table', 'testCol')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('building_table', sa.Column('testCol', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    # ### end Alembic commands ###