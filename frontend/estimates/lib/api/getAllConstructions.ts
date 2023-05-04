import { allProjects } from "@/const/apiRout";

export const getAllStructures = async (): Promise<Structure[]> => {
  const result = await fetch(allProjects, {
    next: { revalidate: 60 },
  });

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
};
