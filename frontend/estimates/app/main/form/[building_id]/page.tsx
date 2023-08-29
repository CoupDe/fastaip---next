import { getAllFormData } from "@/lib/api/getAllFormData";
import React, { Suspense } from "react";
import Loading from "../loading";
import FormTable from "@/components/formTable/FormTable";
import TheadTable from "@/components/visrTable/TheadTable";

type Props = { params: { building_id: string } };

export default async function page({ params }: Props) {
  const result = await getAllFormData(params.building_id);

  return <FormTable dataForm={result} />;
}
