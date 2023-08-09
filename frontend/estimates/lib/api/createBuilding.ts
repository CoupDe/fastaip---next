import { createBuildingRout } from "@/const/apiRout";

const customError = (status: number, detail: string): FetchError => {
  return { status, detail };
};

const createBuilding = async (
  data: Building
): Promise<Building | FetchError> => {
  const response = await fetch(createBuildingRout(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const text = await response.text();

    const err = JSON.parse(text);
    if ("detail" in err) {
      let myError: FetchError;
      myError = customError(response.status, err.detail);

      return myError;
    }
  }
  return response.json();
};

export default createBuilding;
