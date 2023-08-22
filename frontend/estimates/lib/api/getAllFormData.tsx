import { getAllFormDataRout } from "@/const/apiRout";
import next from "next/types";

export interface FormKS {
  visr_identifier: string | null;
  building_code: string | null;
  blueprint_project_number: string | null;
  local_num: string | null;
  type_work: string;
  unit: string | null;
  quantity: number | null;
  unit_cost: number | null;
  total_cost: number | null;
  chapter: number | null;
}

export async function getAllFormData(building_id: string): Promise<FormKS[]> {
  const result = await fetch(getAllFormDataRout(building_id));
  console.log('result in function', result)
  if (!result.ok) {
    throw Error("Failed");
  }
  return result.json();
}
