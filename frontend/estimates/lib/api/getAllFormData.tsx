import { getAllFormDataRout } from "@/const/apiRout";

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
  await new Promise((res, rej) => setTimeout(res, 100));
  const result = await fetch(getAllFormDataRout(building_id), {
    cache: "force-cache",
  });

  if (!result.ok) {
    throw Error("Failed");
  }
  return result.json();
}
