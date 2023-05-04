import { buildingById } from "@/const/apiRout";

export const getBuildingById = async (id: string): Promise<Building> => {
  const result = await fetch(buildingById + `${id}`);

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
};
