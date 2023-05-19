type Building = {
  name: string;
  code_building: string;
  readonly id: string;
};

type Structure = {
  name: string;
  code_structure: string;
  id: number;
  buildings: Building[];
};
type Construction = {
  name: string;
  code_structure: string;
  id?: number;
};

type ActiveLink = "projects" | "import" | null;
