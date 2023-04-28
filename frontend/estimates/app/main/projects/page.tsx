import "server-only";
import { getAllStructures } from "@/lib/api/getAllConstructions";
import ConstructionItem from "@/components/building/BuildingItem";
import { Suspense } from "react";

type Props = {};

const Project = async (props: Props) => {
  const projectsData: Promise<Structure[]> = getAllStructures();
  const projects = await projectsData;

  return (
    <>
      {projects.map((project) => (
        <details key={project.id} className="group relative">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
            <ul
              role="list"
              className="ulTree sm:after:content-['\2190'] sm:after:right-[70%]  dark:hover:text-neutral-300 hover:text-gray-700 normal-case"
            >
              <i className="text-neutral-400 mr-2 text-sm">
                {project.code_structure}
              </i>
              {project.name}
            </ul>
          </summary>

          <ConstructionItem buildings={project.buildings} />
        </details>
      ))}
    </>
  );
};

export default Project;
