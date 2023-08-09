import { allConstructionsRout } from "@/const/apiRout";

export const getAllStructures = async (): Promise<Structure[]> => {
  const result = await fetch(allConstructionsRout(), { cache: "no-cache" });

  if (!result.ok) {
    throw new Error("Failed fetch data");
  }
  return result.json();
};
