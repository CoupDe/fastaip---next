import { patchConstructionRout } from "@/const/apiRout";

const patchConstruction = async (data: Construction): Promise<Construction> => {
  const response = await fetch(patchConstructionRout + `${data.id}`, {
    method: "PATCH",
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

export default patchConstruction;
