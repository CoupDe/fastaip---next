"use client";
import React, { useEffect } from "react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useAppSelector } from "@/redux/hook";

const Breadcrumbs = () => {
  const buildingName = useAppSelector((state) => state.building.name);
  useEffect(() => {
    console.log("useEffect", buildingName);
  }, [buildingName]);
  console.log("in bread", buildingName);
  return (
    <div className="flex justify-end items-center mt-2 mr-3 ">
      <HomeWorkIcon fontSize="small" />
      <h6 className="text-xs ml-2 pt-1">{buildingName}</h6>
    </div>
  );
};

export default Breadcrumbs;
