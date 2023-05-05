"use client";
import { getBuildingById } from "@/lib/api/getBuildingById";
import { useAppSelector } from "@/redux/hook";
import {
  ActiveBuilding,
  SelectedBuildingList,
} from "@/redux/slice/buildingSlice";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Breadcrumbs() {
  const [isShown, setIsShown] = useState(false);
  const buildingName = useAppSelector(ActiveBuilding);
  const buildingList = useAppSelector(SelectedBuildingList);

  return (
    <div className="flex justify-end mt-2 align-middle mr-3 opacity-70">
      <HomeWorkIcon fontSize="small" />

      <h6
        className="text-xs ml-2   cursor-pointer"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <Link
          href={
            buildingName.id ? `/main/srv/${buildingName.id}` : `/main/projects`
          }
        >
          {buildingName.name}
        </Link>
      </h6>
      {isShown && <p>{JSON.stringify(buildingList.map((pp) => pp.id))}</p>}
    </div>
  );
}
