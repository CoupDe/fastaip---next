import { getAllStructures } from "@/lib/getAllStructure";
import next from "next/types";
import React from "react";

type Props = {};

const Project = async (props: Props) => {
  const projectsData: Promise<Structure[]> = getAllStructures();
  const projects = await projectsData;
  console.log(projects);
  return (
    <div>
      {JSON.stringify(projects)}
      <p>
        {projects.map((project) =>
          project.buildings.map((building) =>
            JSON.stringify(building, null, "\n")
          )
        )}
      </p>
    </div>
  );
};

export default Project;
