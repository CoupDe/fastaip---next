"use client";

import { useTheme } from "next-themes";
import React, { useState } from "react";
import { useEffect } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // для избежания ошибки рендера до монтирования, т.к. сервер не знает какая тема установлена
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <>
      {theme === "light" ? (
        <Brightness4Icon
          className=" text-neutral-400 "
          onClick={() => setTheme("dark")}
        >
          dark
        </Brightness4Icon>
      ) : (
        <Brightness7Icon onClick={() => setTheme("light")}>
          light
        </Brightness7Icon>
      )}
    </>
  );
};

export default ThemeButton;
