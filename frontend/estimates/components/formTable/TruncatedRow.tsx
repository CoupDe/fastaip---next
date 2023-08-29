import { motion } from "framer-motion";
import { useState } from "react";
import PopUpForm from "./PopUpForm";
import React from "react";

type RowProps = {
  dataRow: string | null;
  setSelectedId: (id: string | null) => void;
  isSelected: boolean;
  visr_id: string;
  isBlocked: boolean;
};

export const TruncatedRow = ({
  dataRow,
  setSelectedId,
  isSelected,
  visr_id,
  isBlocked,
}: RowProps) => {
  const [showData, setisShowData] = useState<boolean>(false);

  const handleMouseEnter = () => {
    if (!isSelected) {
      setisShowData(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSelected) {
      setisShowData(false);
    }
  };
  const handleFixData = () => {
    if (isSelected) {
      setSelectedId(null); // Снимаем выделение
    } else {
      setSelectedId(visr_id); // Выделяем текущий элемент
      setisShowData(false);
    }
  };

  // Ограничивает количество символов для вывода
  let isTruncated: boolean = false;
  let truncated: string = "";
  if (dataRow) {
    truncated =
      dataRow?.length > 30 ? dataRow.substring(0, 30) + "..." : dataRow;
    isTruncated = truncated !== dataRow;
  }

  return (
    <motion.td
      className={`bg-gray-800 text-white p-1 ${
        isTruncated && "hover:cursor-pointer border-r-2 border-r-gray-400"
      } ${isSelected && "text-cyan-300"}`}
      onMouseEnter={() => {
        if (isTruncated && !isBlocked) handleMouseEnter();
      }}
      onMouseLeave={() => {
        if (isTruncated && !isBlocked) handleMouseLeave();
      }}
      onClick={isTruncated ? handleFixData : undefined}
    >
      {(showData || (isSelected && isTruncated)) && (
        <PopUpForm dataRow={dataRow} />
      )}
      <motion.p className="">{truncated}</motion.p>
    </motion.td>
  );
};
