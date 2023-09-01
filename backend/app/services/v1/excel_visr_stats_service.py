from pandas import DataFrame
from pydantic import BaseModel


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


class ExcelAnalyzer:
    """Класс проверяет пусты листы, исключает их и сохраняет чистый df,
    проверяет на соответсвие требованиям формата для импорта и дальнейшей работы с файлами
    """

    def __init__(self, data: dict[str, DataFrame]):
        self.visrs_df, self.empty_dfs_count = self.clean_empty_df(data)
        self.visr_df_id, self.visr_non_id = self._search_id_visr()

    def clean_empty_df(
        self, data: dict[str, DataFrame]
    ) -> tuple[dict[str, DataFrame], int]:
        """Очищает от пустых листов, возвращает реальные DF

        Args:
            data (dict[int  |  str, DataFrame]): _description_

        Returns:
            tuple[dict[int | str, DataFrame], int]: Список DF, Количество удаленных пустых листов
        """
        result = {k: v for (k, v) in data.items() if not v.empty}
        empty_count = len(data) - len(result)

        return result, empty_count

    def _search_id_visr(self) -> tuple[dict[str, DataFrame], dict[str, DataFrame]]:
        """Определяет есть ли в названии идентификатор ВИСРа  (split/int/.)"""
        visr_with_id: dict[str, DataFrame] = {}
        visr_without_id: dict[str, DataFrame] = {}
        for sheets_name, df in self.visrs_df.items():
            visr_id = sheets_name.split(None, 1)[0]  # Получение id
            if visr_id[0].isdigit() and visr_id.count(".") > 1:
                visr_with_id |= {sheets_name: df}
            else:
                visr_without_id |= {sheets_name: df}
        return visr_with_id, visr_without_id

    def set_header(self):
        ss = list(self.visr_df_id.keys())

        print(self.visr_df_id[ss[0]])

    def get_stats(self) -> StatsData:
        """Предоставляет статистику по импорту

        Returns:
            StatsData: _description_
        """
        data = StatsData(
            empty_dfs_count=self.empty_dfs_count,
            visr_df_id=len(self.visr_df_id),
            visr_non_id=len(self.visr_non_id),
        )
        return data
