import { buildingByIdRout } from "@/const/apiRout";

export const getBuildingById = async (id: string): Promise<Building> => {
  const result = await fetch(buildingByIdRout + `${id}`);

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
};
