"use client";
import { getBuildingById } from "@/lib/api/getBuildingById";
import { useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import Link from "next/link";

export default function Breadcrumbs() {
  const buildingName = useAppSelector(ActiveBuilding);

  return (
    <div className="flex justify-end mt-2 align-middle mr-3 opacity-70">
      <HomeWorkIcon fontSize="small" />

      <h6 className="text-xs ml-2   cursor-pointer">
        <Link
          href={
            buildingName.id ? `/main/srv/${buildingName.id}` : `/main/projects`
          }
        >
          {buildingName.name}
        </Link>
      </h6>
    </div>
  );
}
