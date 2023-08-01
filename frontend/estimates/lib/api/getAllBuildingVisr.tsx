import { getAllBuildingsVisrRout } from "@/const/apiRout";
import { StructureVisrResponse } from "@/const/interfaces";

export const getAllBuildingsVisr = async (
  building_id: string
): Promise<StructureVisrResponse[]> => {
  const result = await fetch(
    getAllBuildingsVisrRout(`building/${building_id}/allVisr`),
    { cache: "no-store" }
  );
  if (!result.ok) {
    throw Error("Failed");
  }
  return result.json();
};
