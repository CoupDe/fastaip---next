import { getAllBuildings } from "@/lib/api/getAllBuildings";
import { getBuildingById } from "@/lib/api/getBuildingById";
import store from "@/redux/store/store";

export default async function page() {
  // const buildingData: Promise<Building> = getBuildingById(params.id);
  // const building = await buildingData;

  return <div>Building /srv </div>;
}

// export async function generateStaticParams() {
//   const buildingData: Promise<Building[]> = getAllBuildings();
//   const buildings = await buildingData;
//   console.log("static");
//   return buildings.map((building) => ({
//     id: building.id.toString(),
//   }));
// }
