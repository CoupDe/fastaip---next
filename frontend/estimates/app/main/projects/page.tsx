import BuildingItem from "@/components/building/BuildingItem";
import { getAllStructures } from "@/lib/api/getAllConstructions";
import "server-only";

type Props = {};

const Project = async (props: Props) => {
  const projects = await getAllStructures();
  
  return (
    <>
      {projects.map((project) => (
        <details key={project.id} className="group relative w-1/2">
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

          <BuildingItem buildings={project.buildings} />
        </details>
      ))}
    </>
  );
};

export default Project;
