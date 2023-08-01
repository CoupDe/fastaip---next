import { EstimateVisr, StructureVisrResponse, Visr } from "@/const/interfaces";
import { createColumnHelper } from "@tanstack/react-table";
type TVisr = StructureVisrResponse & EstimateVisr;
export const columnHelper1 = createColumnHelper<StructureVisrResponse>();
export const columnHelper2 = createColumnHelper<EstimateVisr>();
const columns1 = [
    columnHelper1.accessor("id", { header: "ID" }),
    columnHelper1.accessor("name_visr", { header: "Название" }),
    columnHelper1.accessor("type_work", { header: "Тип работы" }),
    columnHelper1.accessor("total_cost", { header: "Общая стоимость" }),
    columnHelper1.accessor("building_id", { header: "ID здания" }),
  ];
  
  const columns2 = [
    columnHelper2.accessor("id", { header: "ID" }),
    columnHelper2.accessor("name_estimate", { header: "Название сметы" }),
    columnHelper2.accessor("local_num", { header: "Локальный номер" }),
    columnHelper2.accessor("machine_num", { header: "Номер машины" }),
    columnHelper2.accessor("chapter", { header: "Глава" }),
  ];