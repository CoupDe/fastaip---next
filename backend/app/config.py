import os

# DB_USERNAME = 'coup'
# DB_PASSWORD = 'C0l0ssok'
# DB_HOST = 'localhost'
# DB_PORT = '5433'
# DB_NAME = 'estimates'
origins = [
    "http://localhost:3000",
]


class Config:
    DB_USER = os.getenv("DB_USER", "coup")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "C0l0ssok")
    DB_NAME = os.getenv("DB_NAME", "estimates")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5433")
    DB_CONFIG = (
        f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    # 127.0.0.1

