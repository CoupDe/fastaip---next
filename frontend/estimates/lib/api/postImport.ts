import { postImportFiles } from "@/const/apiRout";
export type ImportData = {
  filesInfo: [string, number][];
  detail: string;
  tempFileId: string;
  confirmation: boolean;
};
const postFiles = async (data: File[], id: string): Promise<ImportData> => {
  //  Передача формата файлов должна быть преобразована в FormData
  const formData = new FormData();
  for (let i = 0; i < data.length; i++) {
    formData.append(`files`, data[i]);
  }
  //  Странно, но с передачей header сервер выдает ошибку
  const response = await fetch(postImportFiles + `${id}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed fetch data");
  }

  return response.json();
};

export default postFiles;
