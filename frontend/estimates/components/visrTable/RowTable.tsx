import {
  Visr,
  EstimateVisr,
  CommonPriceVisr,
  RowData,
} from "@/const/interfaces";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
type RowProps = {
  visrData: Visr | EstimateVisr;
  depth: number;
};
type TableData = {
  dataRow: RowData;
  depth: number;
  children: React.ReactNode[];
};
const bgColorLevel = (depth: number): string => {
  switch (depth) {
    case 1:
      return "bg-gray-600";
    case 2:
      return "bg-slate-500";
    default:
      return "bg-gray-800";
  }
};
const RowTable: React.FC<TableData> = ({ dataRow, depth, children }) => {
  const [show, setShow] = React.useState<boolean>(false);
  console.log(depth, children);
  return (
    <>
      <tr className={`${bgColorLevel(depth)} dark:text-white`}>
        <td className="p-1">
          <div className="align-items-center flex items-center">
            <button onClick={() => setShow(!show)}>
              {!show ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
            </button>
            <div className="ml-3 mt-1">
              <div className="">Appple</div>
            </div>
          </div>
        </td>
        <td className="p-1">{dataRow.code}</td>
        <td className="p-1 text-xs font-bold">{dataRow.name}</td>
        <td className="p-1">
          <span className=" text-xs font-bold">{dataRow.type_work}</span>
        </td>
        <td className="p-1 ">
          <a href="#" className="mr-2 text-gray-400 hover:text-gray-100">
            <i className="material-icons-outlined text-base">visibility</i>
          </a>
          <a href="#" className="mx-2 text-gray-400  hover:text-gray-100">
            <i className="material-icons-outlined text-base">edit</i>
          </a>
          <a href="#" className="ml-2 text-gray-400  hover:text-gray-100">
            <i className="material-icons-round text-base">delete_outline</i>
          </a>
        </td>
        <td className="p-1">Technology</td>
        <td className="p-1">Technology</td>
        <td className="p-1 ">
          <i className="material-icons-outlined text-base">
            {dataRow.total_cost}
          </i>
        </td>
      </tr>
      {show && children}
    </>
  );
};

export default RowTable;
