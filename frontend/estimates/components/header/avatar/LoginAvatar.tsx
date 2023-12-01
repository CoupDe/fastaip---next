"use client";
import React, { Fragment } from "react";
import Image from "next/image";
import avatar from "../../../public/avatar.svg";
import { signOut } from "next-auth/react";


type Props = { image: string | null | undefined };

function LoginAvatar({ image }: Props) {
  return (
    <div  className="relative z-10 inline-block text-left">
      <div>
        <div className="inline-flex w-full justify-center text-sm font-semibold  ">
          <Image
            className="rounded-xl"
            src={image || avatar}
            alt="avatar"
            width={30}
            height={30}
            aria-hidden="true"
          />
        </div>
      </div>
      <>
        {/* <div
          className="absolute right-0 mt-2 w-36 origin-top-right overflow-hidden rounded-md bg-neutral-400/70  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div>
            <button
              className="w-full px-2 py-2 text-left text-xs text-gray-700 hover:cursor-not-allowed hover:bg-slate-300 hover:line-through"
              disabled
              role="menuitem"
              id="menu-item-1"
            >
              Настройки
            </button>
          </div>
          <div>
            <button
              className="w-full px-2 py-2 text-left text-xs text-gray-700 hover:bg-slate-300"
              role="menuitem"
              id="menu-item-2"
              onClick={() =>
                signOut({ callbackUrl: "http://localhost:3000/login" })
              }
            >
              Выход
            </button>
          </div> */}
        {/* </div> */}
      </>
    </div>
  );
}

export default LoginAvatar;
