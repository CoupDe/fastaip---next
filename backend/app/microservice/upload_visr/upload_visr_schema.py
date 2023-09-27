from pydantic import BaseModel, ConfigDict


class BaseErrorResponse(BaseModel):
    detail: str


class StatsData(BaseModel):
    empty_dfs_count: int 
    visr_df_id: int 
    visr_non_id: int 

    def __str__(self) -> str:
        return (
            f"Пустых листов: {self.empty_dfs_count}\n"
            f"ВИСР-ов с идентификатором: {self.visr_df_id}\n"
            f"ВИСР-ов без идентификатора: {self.visr_non_id}"
        )


class UploadFileResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    redis_key_id: str | None = None
    redis_key_non_id: str | None = None
    tasks_key: str
    file_name: str
    stats: StatsData
