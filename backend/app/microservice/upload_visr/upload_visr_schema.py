from pydantic import BaseModel, ConfigDict


class BaseErrorResponse(BaseModel):
    detail: str


class StatsData(BaseModel):
    empty_dfs_count: int | None = None
    visr_df_id: int | None = None
    visr_non_id: int | None = None

    def __str__(self) -> str:
        return (
            f"Пустых листов: {self.empty_dfs_count}\n"
            f"ВИСР-ов с идентификатором: {self.visr_df_id}\n"
            f"ВИСР-ов без идентификатора: {self.visr_non_id}"
        )


class UploadFileResponse(BaseModel):
    model_config = ConfigDict(extra='ignore')
    path_to_visr_id: str | None = None
    path_to_visr_non_id: str | None = None
    stats: StatsData
