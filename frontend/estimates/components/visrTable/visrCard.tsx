"use client";
import {
  CommonPriceVisr,
  EstimateVisr,
  EstimatedPrice,
  StructureVisrResponse,
  Visr,
} from "@/const/interfaces";
import React, { FC } from "react";
import TheadTable from "./TheadTable";
import { isEstimate, isEstimatedPrice, isVisr } from "@/const/typegurads";
import RowTable from "./RowTable";
import { convertToDataRow } from "@/lib/util/service";

type VisrProp = {
  visrs: StructureVisrResponse[];
};

function createTable(visr: any[], depth: number = 0): React.ReactNode[] {
  const levelVisr: React.ReactNode[] = [];
  const dataRow: Partial<CommonPriceVisr> & { type_work?: string } = {};

  for (let index in visr) {
    if (isVisr(visr[index])) {
      const dt = visr[index] as Visr;

      const dtRow = convertToDataRow({
        name: dt.name_visr,
        type_work: dt.type_work,
        total_cost: dt.total_cost,
      });
      const children = createTable(visr[index]["estimates"], depth + 1);
      levelVisr.push(
        <RowTable
          key={dt.id}
          depth={depth}
          dataRow={dtRow}
          children={children}
        />
      );
    }
    if (isEstimate(visr[index])) {
      console.log("depth in Estimate", depth);
      const dt = visr[index] as EstimateVisr;
      const dtRow = convertToDataRow({
        code: dt.local_num + "/" + dt.machine_num,
        name: dt.name_estimate,
      });
      console.log(
        'visr[index]["estimated_price"]',
        visr[index]["estimated_prices"]
      );
      const children = createTable(visr[index]["estimated_prices"], depth + 1);
      console.log("children", children);
      levelVisr.push(
        <RowTable
          key={dt.id}
          depth={depth}
          dataRow={dtRow}
          children={children}
        />
      );
    }
    if (isEstimatedPrice(visr[index])) {
      console.log("depth in Estimated Price", depth);
      const dt = visr[index] as EstimatedPrice;
      const dtRow = convertToDataRow({
        code: dt.code,
        name: dt.name,
        unit: dt.unit,
        unit_cost: dt.unit_cost,
        total_cost: dt.total_cost,
        quantity: dt.quantity,
        pos: dt.pos,
      });

      const children = createTable(visr[index]["estimates"], depth + 1);
      levelVisr.push(
        <RowTable
          key={dt.id}
          depth={depth}
          dataRow={dtRow}
          children={children}
        />
      );
    }
  }
  return levelVisr;
}
const VisrCard: FC<VisrProp> = ({ visrs }) => {
  const [data, setDataVisr] = React.useState(visrs);

  return (
    <div className=" w-full">
      <div className="w-full overflow-auto">
        <table className="table w-full border-separate space-y-6 text-sm text-gray-400">
          <TheadTable />
          <tbody>
            <tr className="bg-gray-800">
              <td className="p-3">
                <div className="align-items-center flex">
                  <div className="ml-3">
                    <div className="">Appple</div>
                    <div className="text-gray-500">mail@rgmail.com</div>
                  </div>
                </div>
              </td>
              <td className="p-3">Technology</td>
              <td className="p-3 font-bold">200.00$</td>
              <td className="p-3">
                <span className="rounded-md bg-green-400 px-2 text-gray-50">
                  available
                </span>
              </td>
              <td className="p-3 ">
                <a href="#" className="mr-2 text-gray-400 hover:text-gray-100">
                  <i className="material-icons-outlined text-base">
                    visibility
                  </i>
                </a>
                <a href="#" className="mx-2 text-gray-400  hover:text-gray-100">
                  <i className="material-icons-outlined text-base">edit</i>
                </a>
                <a href="#" className="ml-2 text-gray-400  hover:text-gray-100">
                  <i className="material-icons-round text-base">
                    delete_outline
                  </i>
                </a>
              </td>
            </tr>
            {createTable(data)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default VisrCard;
