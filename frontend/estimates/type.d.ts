interface FetchError {
  detail: string;
  status: number;
}

interface Building {
  name: string;
  code_building: string;
  readonly id?: string;
  structure_id: string;
}
interface Construction {
  name: string;
  code_structure: string;
  readonly id?: string;
}
interface Structure {
  name: string;
  code_structure: string;
  id: string;
  buildings: Building[];
}

type FormStatus = "newConstruction" | "editConstruction" | "newBuilding";
type ActiveLink = "projects" | "import" | "form" | null;
interface ModalFormProps {
  construction?: Construction;
  showForm: FormStatus;
}
type SearchFormats = { badFormat: File[]; okFormat: File[] };
