import { postImportFilesConfirmRout } from "@/const/apiRout";
import { revalidatePath } from "next/cache";

export interface ImportVisrResponse {
  name_visr: string;
  type_work: string;
  total_cost: number;
}
export type ErrorImportResponse = {
  detail: string;
};
export interface IDetailResponseImport {
  detail: ImportVisrResponse[];
}
export const acceptImport = async (
  tempFileId: string,
  confirmation: boolean,
  id: string
): Promise<IDetailResponseImport | ErrorImportResponse> => {
  const data = { tempFileId, confirmation, id };

  const response = await fetch(
    postImportFilesConfirmRout + `${id}` + "/confirm/",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorImportResponse: ErrorImportResponse = await response.json();
    throw errorImportResponse;
  } else {
    const response_data: IDetailResponseImport = await response.json();

    return response_data;
  }
};
