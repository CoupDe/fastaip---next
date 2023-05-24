import { createBuildingRout } from "@/const/apiRout";

const createBuilding = async (data: Building): Promise<Building> => {
  const response = await fetch(createBuildingRout, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed fetch data");
  }
  return response.json();
};

export default createBuilding;
