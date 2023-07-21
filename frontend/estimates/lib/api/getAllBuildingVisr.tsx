import { getAllBuildingsVisrRout } from "@/const/apiRout";
import { StructureVisrResponse } from "@/const/interfaces";
import { error } from "console";

export const getAllBuildingsVisr = async (
  building_id: string
): Promise<StructureVisrResponse[]> => {
  const result = await fetch(
    getAllBuildingsVisrRout(`building/${building_id}/allVisr`),
    { cache: "no-store" }
  );
  if (!result.ok) {
    throw error("Failed");
  }
  return result.json();
};
