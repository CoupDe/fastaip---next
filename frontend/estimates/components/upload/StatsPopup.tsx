import { StatsData } from "@/lib/api/uploadVisrFiles/postVisrFiles";
import React from "react";

const StatsInfo = ({ empty_dfs_count, visr_df_id, visr_non_id }: StatsData) => {
  return (
    <div className="absolute right-20 inline-block opacity-50 bg-white text-xs dark:bg-gray-900 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 shadow-lg p-2 rounded-lg">
      <p>ВИСР с ID: {visr_df_id}</p>
      <p>ВИСР без ID: {visr_non_id}</p>
      <p>Пустые ВИСР: {empty_dfs_count}</p>
    </div>
  );
};

export default StatsInfo;
