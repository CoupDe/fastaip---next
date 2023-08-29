"use client";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  dataRow: string | null;
};
const variants = {
  open: { opacity: 1, y: "-20px", transition: { delay: 0.2 } },
  hidden: { opacity: 0, y: 0 },
};
const PopUpForm: React.FC<Props> = ({ dataRow }: Props) => {
  return (
    <motion.div
      className={`absolute bottom-0 right-[50px] max-w-[300px] text-white  bg-gray-500 p-1 opacity-50`}
      animate="open"
      initial="hidden"
      variants={variants}
    >
      <p>{dataRow}</p>
    </motion.div>
  );
};

export default PopUpForm;
