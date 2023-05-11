"use client";
import { useAppDispatch } from "@/redux/hook";
import { setBuilding } from "@/redux/slice/buildingSlice";
import React from "react";
interface iBuilding {
  buildings: Building[];
}
const BuildingItem: React.FC<iBuilding> = ({ buildings }) => {
  const dispatch = useAppDispatch();
  return (
    <>
      {buildings.map((building) => (
        <li
          key={building.id}
          className="list-none indent-6  dark:hover:text-neutral-300 hover:text-gray-700"
        >
          <i className="text-neutral-400 mr-2 text-sm">
            {building.code_building}
          </i>
          <button onClick={() => dispatch(setBuilding(building))}>
            <p>{building.name}</p>
          </button>
        </li>
      ))}
    </>
  );
};

export default BuildingItem;
