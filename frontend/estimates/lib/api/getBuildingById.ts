import { buildingById } from "@/const/apiRout";

export async function getBuildingById(id: string) {
  const result = await fetch(buildingById + `${id}`);

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
}
