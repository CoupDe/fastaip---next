import { getAllBuildings } from "@/lib/api/getAllBuildings";
import { getBuildingById } from "@/lib/api/getBuildingById";

type Props = { params: { id: string } };

export default async function page({ params }: Props) {
  const building = await getBuildingById(params.id);
  
  return <div>Building {JSON.stringify(building)}</div>;
}
