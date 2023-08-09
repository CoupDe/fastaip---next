"use client";
import {
  AdditionPrice,
  EstimateVisr,
  EstimatedPrice,
  LaborPrice,
  StructureVisrResponse,
  Visr,
} from "@/const/interfaces";
import {
  isAdditionPrice,
  isEstimate,
  isEstimatedPrice,
  isLaborPrice,
  isVisr,
} from "@/const/typegurads";
import { convertToDataRow } from "@/lib/util/service";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllVisrs, setVisr } from "@/redux/slice/structureVisrData";
import React, { FC } from "react";
import RowTable from "./RowTable";
import TheadTable from "./TheadTable";

type VisrProp = {
  visrs: StructureVisrResponse[];
};
//Рекусривная функция по созданию строк таблицыы
function createTable(
  visr: any[],
  parentId: number | null,
  depth: number = 0
): React.ReactNode[] {
  const levelVisr: React.ReactNode[] = [];

  // Перебор массива
  for (let index in visr) {
    // Определение ВИСР
    if (isVisr(visr[index])) {
      const dt = visr[index] as Visr;

      const dtRow = convertToDataRow({
        id: dt.id,
        parentId: parentId,
        name: dt.type_work,
        code: dt.name_visr,
        total_cost: dt.total_cost,
      });
      const children = createTable(visr[index]["estimates"], dt.id, depth + 1);
      levelVisr.push(
        <RowTable key={dt.id} depth={depth} dataRow={dtRow}>
          {children}
        </RowTable>
      );
    }
    // Определение сметы
    if (isEstimate(visr[index])) {
      const dt = visr[index] as EstimateVisr;
      const dtRow = convertToDataRow({
        id: dt.id,
        parentId: parentId,
        code: dt.local_num + "/" + dt.machine_num,
        name: dt.name_estimate,
      });

      const children = createTable(
        visr[index]["estimated_prices"],
        dt.id,
        depth + 1
      );

      levelVisr.push(
        <RowTable key={dt.id} depth={depth} dataRow={dtRow}>
          {children}
        </RowTable>
      );
    }
    // Определение расценки
    if (isEstimatedPrice(visr[index])) {
      const dt = visr[index] as EstimatedPrice;

      const dtRow = convertToDataRow({
        id: dt.id,
        parentId: parentId,
        code: dt.code,
        name: dt.name,
        unit: dt.unit,
        unit_cost: dt.unit_cost,
        total_cost: dt.total_cost,
        quantity: dt.quantity,
        pos: dt.pos,
      });

      const children = createTable(visr[index]["labors"], dt.id, depth + 1);
      const children2 = createTable(
        visr[index]["additional_prices"],
        dt.id,
        depth + 1
      );
      children.push(children2);
      levelVisr.push(
        <RowTable key={dt.id} depth={depth} dataRow={dtRow}>
          {children}
        </RowTable>
      );
    }
    // Определение трудозатрат
    if (isLaborPrice(visr[index])) {
      const dt = visr[index] as LaborPrice;

      const dtRow = convertToDataRow({
        id: dt.id,
        code: dt.code,
        parentId: parentId,
        name: dt.name,
        unit: dt.unit,
        unit_cost: dt.unit_cost,
        type_work: dt.category,
        total_cost: dt.total_cost,
        quantity: dt.quantity,
        pos: dt.category,
      });

      levelVisr.push(
        <RowTable
          key={dt.id}
          depth={depth}
          dataRow={dtRow}
          // children={children}
        />
      );
    }
    // Определение НР, СП
    if (isAdditionPrice(visr[index])) {
      const dt = visr[index] as AdditionPrice;

      const dtRow = convertToDataRow({
        id: dt.id,
        parentId: parentId,
        name: dt.name,
        total_cost: dt.total_cost,
      });

      levelVisr.push(
        <RowTable
          key={dt.id}
          depth={depth}
          dataRow={dtRow}
          // children={children}
        />
      );
    }
  }
  return levelVisr;
}
const VisrCard: FC<VisrProp> = ({ visrs }) => {
  const dispatch = useAppDispatch();
  dispatch(setVisr(visrs));
  const data = useAppSelector(getAllVisrs);

  return (
    <div className=" w-full">
      <div className="w-full overflow-auto">
        <table className="table w-full border-separate space-y-6 text-sm text-gray-400">
          <TheadTable />
          <tbody>{createTable(data, null)}</tbody>
        </table>
      </div>
    </div>
  );
};
export default VisrCard;
