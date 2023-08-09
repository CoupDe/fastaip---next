import { getAllBuildingsVisrRout } from "@/const/apiRout";
import { StructureVisrResponse } from "@/const/interfaces";

export const getAllBuildingsVisr = async (
  building_id: string
): Promise<StructureVisrResponse[]> => {
  const result = await fetch(getAllBuildingsVisrRout(building_id, "allVisr"), {
    cache: "no-store",
  });
  if (!result.ok) {
    let errorMessage;

    const contentType = result.headers.get("content-type");
    console.log("contentType", contentType);
    if (contentType && contentType.includes("application/json")) {
      const errorData = await result.json();
      console.log("errorData", errorData);
      errorMessage = errorData.message;
    } else {
      errorMessage = await result.text(); // Чтение тела ответа как простого текста
    }

    throw Error(errorMessage || result.statusText);
  }
  return result.json();
};
