"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ActiveBuilding,
  ReverseBuildingList,
  setBuilding,
} from "@/redux/slice/buildingSlice";

import HomeWorkIcon from "@mui/icons-material/HomeWork";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import AddConstructionBtn from "./constructionBtn/AddConstructionBtn";
import ImportRadioBtn from "./importBtn/ImportRadioBtn";
import SynchBtn from "./synchBtn/SynchBtn";

const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.03,
    },
  },
  hidden: {
    opacity: 0.5,
    transition: {
      when: "afterChildren",
    },
  },
};

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 10 },
};
export default function Breadcrumbs() {
  const [isShow, setIsShow] = useState(false);
  const buildingName = useAppSelector(ActiveBuilding);
  const dispatch = useAppDispatch();
  const segment = useSelectedLayoutSegment() as ActiveLink;
  const params = useParams();
  const buildingList = useAppSelector(ReverseBuildingList);
  const handleSelectBuilding = (building: Building) => {
    setIsShow(false);
    dispatch(setBuilding(building));
  };

  if (segment === "(home)") {
    return null;
  }
  return (
    <div
      className={`flex ${
        segment ? "justify-between" : "justify-end"
      } mx-3 mt-2  min-h-[39px] items-center `}
    >
      {segment === "projects" && <AddConstructionBtn />}
      {segment === "import" && <ImportRadioBtn />}
      {segment === "form" && <SynchBtn building_id={buildingName.id} />}

      <motion.nav
        layout="position"
        transition={{ duration: 0.7 }}
        animate={{ opacity: [1, 0, 1, 0.5, 1] }}
        className=" relative   flex items-center "
      >
        <div className="relative mr-3">
          <div>
            <HomeWorkIcon
              onMouseEnter={() => buildingList.length && setIsShow(true)}
            />
          </div>
          {isShow && (
            <>
              <div
                className="absolute  -left-20 -top-2 h-20 min-w-[110px]"
                onMouseLeave={() => setIsShow(false)}
              >
                <div className="absolute z-50  top-8 min-w-[150px] rounded bg-neutral-400/70 opacity-80">
                  <motion.ul initial="hidden" animate="visible" variants={list}>
                    {buildingList.map((build) => (
                      <motion.li
                        variants={item}
                        key={build.id}
                        className="cursor-pointer px-1  hover:rounded hover:bg-slate-400"
                        onClick={() => handleSelectBuilding(build)}
                      >
                        <Link href={`/main/srv/${build.id}`} className="block ">
                          {build.name}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </>
          )}
        </div>

        <Link
          className="cursor-pointer text-xs"
          href={
            buildingName.id ? `/main/srv/${buildingName.id}` : `/main/projects`
          }
        >
          {buildingName.name}
        </Link>
      </motion.nav>
    </div>
  );
}
