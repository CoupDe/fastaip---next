"use client";
import { getBuildingById } from "@/lib/api/getBuildingById";
import { useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import HomeWorkIcon from "@mui/icons-material/HomeWork";


export default function Breadcrumbs() {
  const buildingName = useAppSelector(ActiveBuilding);

  // async function getBuilding(id: string | undefined) {
  //   if (buildingName.id !== undefined) {
  //     const buildingData: Promise<Building> = getBuildingById(buildingName.id);
  //     const building = await buildingData;
  //     console.log(building);
  //     return building;
  //   } else {
  //     return;
  //   }
  // }

  return (
    <div className="flex justify-end mt-2 align-middle mr-3 opacity-70">
      <HomeWorkIcon fontSize="small" />
      <button>aaa</button>
      <h6 className="text-xs ml-2   cursor-pointer">{buildingName.name}</h6>
    </div>
  );
}
