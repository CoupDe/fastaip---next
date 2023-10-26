import { postImportFilesConfirmRout } from "@/const/apiRout";
import { UploadFileResponse } from "./uploadVisrFiles/postVisrFiles";

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
export type FileRequestPath = Pick<
  UploadFileResponse,
  "redis_key_id" | "redis_key_non_id" | "tasks_key"
>;
export const acceptImport = async (
  importData: FileRequestPath,
  confirmation: boolean,
  id: string
): Promise<IDetailResponseImport | ErrorImportResponse> => {
  const data = { ...importData, confirmation, id };
  console.log("data", data);
  const response = await fetch(postImportFilesConfirmRout(id, "/confirm"), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorImportResponse: ErrorImportResponse = await response.json();
    throw errorImportResponse;
  } else {
    const response_data: IDetailResponseImport = await response.json();

    return response_data;
  }
};
