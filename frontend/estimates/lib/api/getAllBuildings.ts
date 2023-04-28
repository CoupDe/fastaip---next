import { allBuildings, allProjects } from "@/const/apiRout";
import { error } from "console";

export async function getAllBuildings() {
  const result = await fetch(allBuildings);
  if (!result.ok) {
    throw error("Failed");
  }
  return result.json();
}
