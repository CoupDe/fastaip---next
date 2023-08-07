"use client";
import { useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import Link from "next/link";
import React from "react";

type Props = {};

const NavPanel = (props: Props) => {
  const selectedBuilding = useAppSelector(ActiveBuilding);

  const navigetionLink = [
    { name: "Объекты", link: "/main/projects" },
    {
      name: "Структура",
      link: `/main/srv/${selectedBuilding.id ? selectedBuilding.id : ""}`,
    },
    {
      name: "формы КС-6",
      link: `/main/form/${selectedBuilding.id ? selectedBuilding.id : ""}`,
    },
    { name: "Импорт", link: "/main/import" },
    { name: "Отчеты", link: "/reports" },
  ];
  return (
    <nav className="flex items-center .nav">
      <ul className="flex gap-2 place-content-center uppercase  ">
        {navigetionLink.map((link, i) => (
          <li key={i}>
            <Link
              className="navLink  text-sm  sm:text-lg"
              href={link.link}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavPanel;
