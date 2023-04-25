import "server-only";
import { getAllStructures } from "@/lib/getAllStructure";
import ConstructionItem from "@/components/building/BuildingItem";

type Props = {};

const Project = async (props: Props) => {
  const projectsData: Promise<Structure[]> = getAllStructures();
  const projects = await projectsData;
  console.log(projects);
  return (
    <div>
      <div>
        {projects.map((project) => (
          <details className="group relative">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none  ">
              <ul
                key={project.id}
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
            {/* {project.buildings.map((building) => (
                <li key={building.id} className="list-none indent-14">
                  {building.code_building} ---&#8594; {building.name}
                </li>
              ))} */}
          </details>
        ))}
      </div>
    </div>
  );
};

export default Project;
