"use client";
import { FormKS } from "@/lib/api/getAllFormData";
import React from "react";

import FormTableRow from "./FormTableRow";

type Props = { dataForm: FormKS[] };

const FormTable = (props: Props) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <>
      {props.dataForm.map((row) => (
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
