"use client";

import React, { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EstimatedPrice,
  IModalVisr,
  StructureVisrResponse,
} from "@/const/interfaces";
import { EditableCell } from "./EditableCell";
type Props = { visr_data: IModalVisr; children?: React.ReactNode };

const VisrModal: React.FC<Props> = (props: Props) => {
  const [showEditableColumns, setshowEditableColumns] = useState(false);

  const router = useRouter();
  const lastEstimatesPrice =
    props.visr_data.estimates[0].estimated_prices.length - 1;

  return (
    <div
      onClick={() => router.back()}
      className="w-full h-full bg-gray-500 backdrop-blur-sm fixed bg-opacity-70 top-0 left-0 z-40 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full mx-1 z-50  bg-slate-300  shadow-lg p-2 flex-col relative text-slate-900"
      >
        <div className="flex flex-wrap justify-center ">
          <h4 className="text-sm px-2 ">{props.visr_data.visrs_id}</h4>
          <h4 className="text-sm px-2">{props.visr_data.type_work}</h4>
        </div>

        <h4 className="text-sm absolute mt-2 mr-2 right-0 inline-block top-0">
          {props.visr_data.estimates[0].local_num}
        </h4>
        <div className="overflow-y-auto max-h-[600px]">
          <table className="w-full   mt-2 text-xs ">
            <thead>
              <tr className="border-b-2 border-red-400">
                <th>Вид работ</th>
                <th>Ед. измерения</th>
                <th>Количество</th>
                <th>Объем</th>
                <th>Стоимость всего</th>
                <th>
                  <button
                    className="w-5 h-5 pt-0.5 rounded-full 
                       bg-blue-500 hover:bg-red-500 text-white"
                    onClick={() => setshowEditableColumns(true)}
                  >
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.visr_data.estimates[0].estimated_prices.map(
                (estimated_prices, index) => (
                  <tr key={estimated_prices.id}>
                    <td
                      className={`border-r-2  ${
                        index === lastEstimatesPrice ? "" : "border-b-2"
                      } border-red-400 `}
                      height={"40px"}
                    >
                      {estimated_prices.name}
                    </td>
                    <td
                      className={`text-center border-r-2  ${
                        index === lastEstimatesPrice ? "" : "border-b-2"
                      } border-red-400 w-[20px]`}
                    >
                      {estimated_prices.unit}
                    </td>
                    <td
                      className={`text-center border-r-2  ${
                        index === lastEstimatesPrice ? "" : "border-b-2"
                      } border-red-400 max-w-10`}
                    >
                      {estimated_prices.unit_cost}
                    </td>
                    <td
                      className={`text-center border-r-2  ${
                        index === lastEstimatesPrice ? "" : "border-b-2"
                      } border-red-400 max-w-10`}
                    >
                      {estimated_prices.quantity}
                    </td>
                    <td
                      className={`text-center  ${
                        index === lastEstimatesPrice ? "" : "border-b-2"
                      } ${
                        showEditableColumns && "border-r-2"
                      } border-red-400 max-w-10`}
                    >
                      {estimated_prices.total_cost}
                    </td>
                    {showEditableColumns && (
                      <>
                        <EditableCell
                          estimated_price={estimated_prices}
                          isLast={index === lastEstimatesPrice ? true : false}
                        />
                      </>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisrModal;
