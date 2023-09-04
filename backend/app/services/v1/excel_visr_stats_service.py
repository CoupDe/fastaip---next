from io import BytesIO
from pandas import DataFrame
import pandas as pd
from pydantic import BaseModel
from schemas.upload_schema import PreparingVisr
from const.pandas_const import SKIPROWS, VISRCOLNAMES


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
    Params:
        self.visr_df_id: list[dict[str,DataFrame]]
        self.visr_non_id: list[dict[str,DataFrame]]
        self.visrs_df: list[dict[str,DataFrame]]
        self.empty_dfs_count: int
    """

    def __init__(self, data: BytesIO):
        self.original_data = self.read_visr_excel(data)
        self.visrs_df, self.empty_dfs_count = self.clean_empty_df()
        self.visr_df_id, self.visr_non_id = self._search_id_visr()
        self.isNotEmpty = bool(self.visr_df_id) or bool(self.visr_non_id)
        self.processed_data_with_id: list[DataFrame] = []
        self.processed_data_non_id: list[DataFrame] = []

    def read_visr_excel(self, data: BytesIO) -> dict[int | str, DataFrame]:
        """Создание базового DF

        Args:
            data (BytesIO): _description_

        Returns:
            dict[int | str, DataFrame]: DF
        """
        df_excel = pd.read_excel(
            data,
            sheet_name=None,
            header=None,
            skiprows=lambda x: x in SKIPROWS,
            thousands=" ",
            decimal=",",
            names=VISRCOLNAMES,
        )
        return df_excel

    def clean_empty_df(self) -> tuple[list[dict[str, DataFrame]], int]:
        """Очищает от пустых листов, возвращает реальные DF

        Args:
            data (dict[int  |  str, DataFrame]): _description_

        Returns:
            tuple[dict[int | str, DataFrame], int]: Список DF, Количество удаленных пустых листов
        """
        result = [{str(k): v} for (k, v) in self.original_data.items() if not v.empty]
        empty_count = len(self.original_data) - len(result)
        return result, empty_count

    def _search_id_visr(
        self,
    ) -> tuple[list[dict[str, DataFrame]], list[DataFrame]]:
        """Определяет есть ли в названии идентификатор ВИСРа  (split/int/.)"""
        visr_with_id: list[dict[str, DataFrame]] = []
        visr_without_id: list[DataFrame] = []
        for visr in self.visrs_df:
            for sheets_name, df in visr.items():
                visr_id = sheets_name.split(None, 1)[0]  # Получение id
                if visr_id[0].isdigit() and visr_id.count(".") > 1:
                    visr_with_id.append({visr_id: df})
                else:
                    visr_without_id.append(df)
        return visr_with_id, visr_without_id

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

    def pre_save_processing_data(self) -> None:
        print("in preSave")

        if self.visr_df_id:
            for visr in self.visr_df_id:
                for visr_id, df in visr.items():
                    self.processed_data_with_id.append(
                        PreparingVisr(df, visr_id).get_process_visr()
                    )  # Можно сделать статическим методом?

        # if self.visr_non_id:
        #     test = PreparingVisr(self.visr_non_id)
        else:
            return {"detail": "Отсутсвуют "}

        print(self.processed_data_with_id[0].loc[0:3, "code"])
