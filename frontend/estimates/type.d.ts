type Building = {
  name: string;
  code_building: string;
  readonly id: number;
};

type Structure = {
  name: string;
  code_structure: string;
  id: number;
  buildings: Building[];
};
