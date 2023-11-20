"use client";
import { FormKS } from "@/lib/api/getAllFormData";
import React from "react";
import { useSearchParams } from "next/navigation";
import FormTableRow from "./FormTableRow";

type Props = { dataForm: FormKS[] };

const FormTable = ({ dataForm }: Props) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // const params = useSearchParams();
  // const isFiltered = params?.get("isFiltered");
  // let filteredData;
  // if (isFiltered) {
  //   filteredData = dataForm.filter((row) => row.visr_id !== null);
  //   console.log(dataForm[0])
  //   console.log(filteredData?.length);
  // }
 
  return (
    <>
      {dataForm.map((row) => (
        <FormTableRow
          key={row.id}
          row={row}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          isBlocked={!!selectedId}
        />
      ))}
    </>
  );
};

export default FormTable;
