"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ActiveBuilding,
  ReverseBuildingList,
  setBuilding,
} from "@/redux/slice/buildingSlice";
import { Popover, Transition } from "@headlessui/react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import Link from "next/link";
import { Fragment, useState } from "react";

export default function Breadcrumbs() {
  const [isShow, setIsShow] = useState(false);
  const buildingName = useAppSelector(ActiveBuilding);
  const dispatch = useAppDispatch();
  const buildingList = useAppSelector(ReverseBuildingList);
  const handleSelectBuilding = (building: Building) => {
    setIsShow(false);
    dispatch(setBuilding(building));
  };

  return (
    <div className="flex justify-end mt-2  mr-3 opacity-70 items-center">
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
            <Popover.Overlay className="z-10  top-8 absolute min-w-[150px] bg-neutral-400/70 rounded">
              <ul>
                {buildingList.map((build) => (
                  <li
                    key={build.id}
                    className="hover:bg-slate-400 hover:rounded cursor-pointer px-1"
                    onClick={() => handleSelectBuilding(build)}
                  >
                    <Link href={`/main/srv/${build.id}`} className="block">
                      {build.name}
                    </Link>
                  </li>
                ))}
              </ul>
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
    </div>
  );
}
