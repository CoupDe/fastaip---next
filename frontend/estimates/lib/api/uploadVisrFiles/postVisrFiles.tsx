import { postImportVIsrRout } from "@/const/apiRout";

export interface ImportData {
  filesInfo: [string, number][];
  detail: string;
  tempFileId: string;
  confirmation: boolean;
}
interface StatsData {
  empty_dfs_count?: number; // int | None
  visr_df_id?: number; // int | None
  visr_non_id?: number; // int | None
}

export interface UploadFileResponse {
  path_to_visr_id?: string; // str | None
  path_to_visr_non_id?: string; // str | None
  stats: StatsData;
}
const postVisrFiles = async (
  data: File[],
  id: string
): Promise<UploadFileResponse> => {
  //  Передача формата файлов должна быть преобразована в FormData
  const formData = new FormData();
  for (let i = 0; i < data.length; i++) {
    formData.append(`files`, data[i]);
  }
  //  Странно, но с передачей header сервер выдает ошибку
 

  try {
    const response = await fetch(postImportVIsrRout(id), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // или await response.json() для JSON
      throw new Error(`Failed to fetch data: ${errorText}`);
    }
  
    return response.json();
  } catch (error) {
    throw error;
  }
};

export default postVisrFiles;
