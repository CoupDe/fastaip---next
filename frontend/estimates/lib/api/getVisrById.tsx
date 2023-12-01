import React from "react";
import { StructureVisrResponse } from "@/const/interfaces";
import { getVisrByIdRout } from "@/const/apiRout";

type GetVisrByIdProps = { building_id: string; visr_id: string };

export const getVisrById = async ({
  building_id,
  visr_id,
}: GetVisrByIdProps): Promise<StructureVisrResponse> => {
  const result = await fetch(getVisrByIdRout(building_id, visr_id), {
    cache: "no-store",
  });
  if (!result.ok) {
    console.error("Error in getVisrById:", result.status, result.statusText);
    throw new Error("Failed to fetch data");
  }
  const data = await result.json();

  return data;
};
