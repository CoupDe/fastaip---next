import { createConstructionRout } from "@/const/apiRout";

export const createConstruction = async (
  data: Construction
): Promise<Construction> => {
  const response = await fetch(createConstructionRout(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
  }
  return response.json();
};
