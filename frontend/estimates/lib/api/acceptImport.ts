import { postImportFilesConfirm } from "@/const/apiRout";
import { ImportData } from "./postImport";

export const acceptImport = async (
  tempFileId: string,
  confirmation: boolean,
  id: string
): Promise<void> => {
  const data = { tempFileId, confirmation, id };
  console.log(data);
  const result = await fetch(postImportFilesConfirm + `${id}` + "/confirm/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
