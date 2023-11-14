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
  id: number;
  visr_id: number;
}

export async function getAllFormData(
  building_id: string,
  param: { page?: string; limit: string }
): Promise<FormKS[]> {
  const searchParams = new URLSearchParams(param).toString();
  console.log(
    "getAllFormDataRout(building_id, `?${searchParams}`)",
    getAllFormDataRout(building_id, `?${searchParams}`)
  );
  const result = await fetch(
    getAllFormDataRout(building_id, `?${searchParams}`),
    { cache: "no-store" }
  );

  if (!result.ok) {
    throw Error(result.url);
  }
  return result.json();
}
