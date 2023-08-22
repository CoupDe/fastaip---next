import { allBuildingsRout } from "@/const/apiRout";

export const getAllBuildings = async (): Promise<Building[]> => {
  const result = await fetch(allBuildingsRout());
  if (!result.ok) {
    throw Error("Failed");
  }
  return result.json();
};
