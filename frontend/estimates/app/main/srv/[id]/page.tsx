import { getAllBuildings } from "@/lib/api/getAllBuildings";
import { getBuildingById } from "@/lib/api/getBuildingById";

type Props = { params: { id: string } };

export default async function page({ params }: Props) {
  // const buildingData: Promise<Building> = getBuildingById(params.id);
  // const building = await buildingData;
  const buildingData: Promise<Building> = getBuildingById(params.id);
  const building = await buildingData;

  return <div>Building {JSON.stringify(building)}</div>;
}
export async function generateStaticParams() {
  const buildingData: Promise<Building[]> = getAllBuildings();
  const buildings = await buildingData;
  console.log("static");
  return buildings.map((building) => ({
    id: building.id.toString(),
  }));
}
