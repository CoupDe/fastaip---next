import { getAllFormData } from "@/lib/api/getAllFormData";
import React, { Suspense } from "react";
import Loading from "./loading";
import FormTable from "@/components/formTable/formtable";

type Props = { params: { building_id: string } };

export default async function page({ params }: Props) {
  const result = await getAllFormData(params.building_id);
  console.log('result in SSR', result);
  return <div><Suspense fallback={<Loading />}><FormTable dataForm={result} /></Suspense></div>;
}
