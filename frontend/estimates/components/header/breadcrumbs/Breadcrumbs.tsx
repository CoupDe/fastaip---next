"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ActiveBuilding,
  ReverseBuildingList,
  setBuilding,
} from "@/redux/slice/buildingSlice";
import { Popover, Transition } from "@headlessui/react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { motion } from "framer-motion";
import Link from "next/link";
import { Fragment, useState } from "react";
import AddConstructionBtn from "./constructionBtn/AddConstructionBtn";
import { useSelectedLayoutSegment } from "next/navigation";

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
  const buildingList = useAppSelector(ReverseBuildingList);
  const handleSelectBuilding = (building: Building) => {
    setIsShow(false);
    dispatch(setBuilding(building));
  };

  return (
    <div
      className={`flex ${
        segment ? "justify-between" : "justify-end"
      } mt-2  mx-3 opacity-70 items-center`}
    >
      {segment === "projects" && <AddConstructionBtn />}
      <motion.nav
        layout="position"
        transition={{ duration: 0.7 }}
        animate={{ opacity: [1, 0, 1, 0.5, 1] }}
        className="flex  mt-2  mr-3 opacity-70 items-center"
      >
        <Popover className="relative mr-3">
          <Popover.Button>
            <HomeWorkIcon
              onMouseEnter={() => buildingList.length && setIsShow(true)}
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            show={isShow}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            {/* Бред */}

            <Popover.Panel
              static
              className="  absolute   -top-2 -left-20 h-20 min-w-[110px] "
              onMouseLeave={() => setIsShow(false)}
            >
              <Popover.Overlay className="z-10  top-8 absolute min-w-[150px] bg-neutral-400/70 rounded ">
                <motion.ul initial="hidden" animate="visible" variants={list}>
                  {buildingList.map((build) => (
                    <motion.li
                      variants={item}
                      key={build.id}
                      className="hover:bg-slate-400 hover:rounded cursor-pointer px-1"
                      onClick={() => handleSelectBuilding(build)}
                    >
                      <Link href={`/main/srv/${build.id}`} className="block">
                        {build.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </Popover.Overlay>
            </Popover.Panel>
          </Transition>
        </Popover>

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
