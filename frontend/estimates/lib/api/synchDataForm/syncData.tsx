import { createBuildingRout, postSynchVisrForms } from "@/const/apiRout";

export const synchVisrWIthForm = async (
  building_id: string
): Promise<number> => {
  const response = await fetch(postSynchVisrForms(building_id));
  if (!response.ok) {
    throw new Error(`Error message ${response.status}`);
  }
  
  const result =  await response.json();
  return result;
};
