"use client";
import { Menu } from "@headlessui/react";
import React, { Fragment } from "react";

type Props = { isShow: boolean };

const BuildingListMenu: React.FC<Props> = (props) => {
  console.log('props', props)
  return (
    <>

      < Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
          </Menu.Button>
        </div>

        <>
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-neutral-400 overflow-hidden  dark:bg-neutral-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                <button
                  className="text-gray-700 px-2 py-2 text-xs hover:bg-slate-300 w-full text-left hover:line-through hover:cursor-not-allowed"
                  disabled
                  role="menuitem"
                  id="menu-item-1"
                >
                  Настройки
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  className="text-gray-700 px-2 py-2 text-xs hover:bg-slate-300 w-full text-left"
                  role="menuitem"
                  id="menu-item-2"
                >
                  Выход
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </>
      </Menu >
    </>
  );
};

export default BuildingListMenu;
