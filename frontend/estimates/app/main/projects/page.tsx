import BuildingItem from "@/components/building/BuildingItem";
import ConstructionItem from "@/components/building/ConstructionItem";
import { getAllStructures } from "@/lib/api/getAllConstructions";
import "server-only";

type Props = {};

const Project = async (props: Props) => {
  const structure = await getAllStructures();

  return (
    <>
      {structure.map((construction) => (
        <details key={construction.id} className=" w-full">
          <summary className="font-medium cursor-pointer list-none ">
            <ConstructionItem construction={construction} />
          </summary>

          <BuildingItem buildings={construction.buildings} />
        </details>
      ))}
    </>
  );
};

export default Project;
