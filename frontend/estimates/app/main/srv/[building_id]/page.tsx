import VisrCard from "@/components/visrTable/VisrCard";
import { getAllBuildingsVisr } from "@/lib/api/getAllBuildingVisr";

type Props = { params: { building_id: string } };

export default async function VisrStructure({ params }: Props) {
  const structureVisr = await getAllBuildingsVisr(params.building_id);
  console.log("structureVisr", structureVisr);
  return (
    <>
      {structureVisr.length ? (
        <VisrCard visrs={structureVisr} />
      ) : (
        // <VisrCard visrs={structureVisr} />
        <h1>ВИСР на данном объекте не существует</h1>
      )}
    </>
  );
}
