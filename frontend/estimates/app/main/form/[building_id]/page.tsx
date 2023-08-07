import React from "react";

type Props = { params: { building_id: string } };

export default async function page({ params }: Props) {
  console.log(params.building_id);
  return <div>{params.building_id}</div>;
}
