import {  allProjects } from "@/const/apiRout";

export async function getAllStructures() {
  const result = await fetch(allProjects, {
    next: { revalidate: 60 },
  });

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
}
