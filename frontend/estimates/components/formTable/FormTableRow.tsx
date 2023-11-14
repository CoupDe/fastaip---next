import { FormKS } from "@/lib/api/getAllFormData";
import React from "react";
import { TruncatedRow } from "./TruncatedRow";

type Props = {
  row: FormKS;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedId: string | null;
  isBlocked: boolean;
};

const parseData = (num: number | null): number | null =>
  num ? (Number.isInteger(num) ? num : parseFloat(num.toFixed(3))) : null;

function FormTableRow({ row, setSelectedId, selectedId, isBlocked }: Props) {
  if (row.visr_id !== null) {
    console.log(row.visr_identifier);
  }
  return (
    <tr className="text-xs ">
      <td className="bg-gray-800 text-white w-6  p-1" align="center">
        {row.visr_identifier}
      </td>
      <td className="bg-gray-800 w-1" align="center">
        <div
          className={`w-2 h-2 ${
            row.visr_id ? "bg-green-300" : "bg-red-400"
          } rounded-full`}
        ></div>
      </td>
      <TruncatedRow
        dataRow={row.building_code}
        isSelected={selectedId === row.visr_identifier}
        setSelectedId={setSelectedId}
        visr_id={row.visr_identifier!}
        isBlocked={isBlocked}
      />
      <TruncatedRow
        dataRow={row.blueprint_project_number}
        isSelected={selectedId === row.visr_identifier}
        setSelectedId={setSelectedId}
        visr_id={row.visr_identifier!}
        isBlocked={isBlocked}
      />

      <td className="bg-gray-800 min-w-56 text-white p-1">{row.type_work}</td>

      <td className="bg-gray-800 text-white p-1 " align="center">
        {row.unit}
      </td>
      <td className="bg-gray-800 text-white p-1 " align="center">
        {parseData(row.quantity)?.toLocaleString("ru-RU")}
      </td>
      <td className="bg-gray-800 text-white p-1 " align="center">
        {row.unit_cost?.toLocaleString("ru-RU")}
      </td>
      <td className="bg-gray-800 text-white p-1 " align="center">
        {row.total_cost?.toLocaleString("ru-RU")}
      </td>
    </tr>
  );
}

export default FormTableRow;
