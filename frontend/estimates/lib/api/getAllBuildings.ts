import { allBuildingsRout } from "@/const/apiRout";
import { error } from "console";

export const getAllBuildings = async (): Promise<Building[]> => {
  const result = await fetch(allBuildingsRout);
  if (!result.ok) {
    throw error("Failed");
  }
  return result.json();
};
