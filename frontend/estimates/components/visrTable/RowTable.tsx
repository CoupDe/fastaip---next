import { EstimateVisr, RowData, Visr } from "@/const/interfaces";
import { checkNumberofPercent } from "@/lib/util/service";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState } from "react";
type RowProps = {
  visrData: Visr | EstimateVisr;
  depth: number;
};
type TableData = {
  dataRow: RowData;
  depth: number;
  children?: React.ReactNode[];
};
const bgColorLevel = (depth: number): string => {
  switch (depth) {
    case 1:
      return "bg-gray-600";
    case 2:
      return "bg-slate-500";
    case 3:
      return "bg-slate-400 text-stone-900";
    default:
      return "bg-gray-800";
  }
};
const RowTable: React.FC<TableData> = ({ dataRow, depth, children }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [percentField, setPercentField] = useState<number | string | null>(
    null
  );
  const [dataCell, setDataCells] = React.useState<number | string | undefined>(
    dataRow.total_cost
  );

  function handleTotalCostChange(
    e: React.ChangeEvent<HTMLInputElement>
    // id: number | undefined
  ) {
    let value = e.target.value;
    value = value.replace(/[^0-9,.]/g, ""); // разрешаем только цифры и запятую
    setPercentField(value); // устанавливаем значение
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let cellValue = checkNumberofPercent(String(percentField));
      if (percentField === 0) setPercentField(null);
      setPercentField(cellValue);
      setIsEditing(false);
    }
  }
  function handleBlur() {
    let cellValue = checkNumberofPercent(String(percentField));
    setPercentField(cellValue);
    setIsEditing(false);
  }
  return (
    <>
      <tr className={`${bgColorLevel(depth)} text-white`}>
        <td className="p-1">
          <div className="align-items-center flex items-center">
            {depth < 3 && (
              <button
                className="hover:text-zinc-400"
                onClick={() => setShow(!show)}
              >
                {!show ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
              </button>
            )}
            <div className={`${depth < 3 ? "mx-2 mt-1" : "mx-4"} text-xs`}>
              <div className="">{dataRow.pos}</div>
            </div>
          </div>
        </td>
        <td className="p-1 text-xs">{dataRow.code}</td>
        <td className="p-1 text-xs font-semibold ">{dataRow.name}</td>
        <td className="text-xs" align="center">
          <span className=" text-xs "> {dataRow.unit}</span>
        </td>
        <td className="p-1 " align="center">
          {dataRow.quantity}
        </td>
        <td className="p-1" align="center">
          {dataRow.unit_cost?.toLocaleString("ru-RU")}
        </td>

        <td className="p-1 " align="center">
          {dataRow.total_cost?.toLocaleString("ru-RU")}
        </td>
      </tr>
      {show && children}
    </>
  );
};

export default RowTable;
