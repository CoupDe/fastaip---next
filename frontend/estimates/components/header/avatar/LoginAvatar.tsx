"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import avatar from "../../../public/avatar.svg";
import { signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
type Props = { image: string | null | undefined };

function LoginAvatar({ image }: Props) {
  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button className="inline-flex w-full justify-center   text-sm font-semibold  ">
          <Image
            className="rounded-xl"
            src={image || avatar}
            alt="avatar"
            width={30}
            height={30}
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-neutral-400 overflow-hidden  dark:bg-neutral-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
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
              onClick={() =>
                signOut({ callbackUrl: "http://localhost:3000/login" })
              }
            >
              Выход
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default LoginAvatar;
