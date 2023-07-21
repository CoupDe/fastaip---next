import { getAllBuildingsVisr } from "@/lib/api/getAllBuildingVisr";



type Props = { params: { id: string } };

export default async function page({ params }: Props) {
  const structureVisr = await getAllBuildingsVisr(params.id);
  console.log("params", params);
  console.log(structureVisr);
  return (
    <div>
      {structureVisr.length ? (
        <h1>structureVisr {structureVisr[0].name_visr}</h1>
      ) : (
        <h1>ВИСР на данном объекте не существует</h1>
      )}
    </div>
  );
}
