export interface ILoginRequest {
  username: string;
  password: string;
}

export interface CommonPriceVisr {
  id: number;

  pos: number;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

type Addition = "NR" | "SP";
type Category = "OZ" | "MM" | "AM" | "MA";
export interface LaborPrice extends CommonPriceVisr {
  category: Category;
}
export interface AdditionPrice {
  id: number;
  pos: number;
  name: Addition;
  total_cost: number;
}

export interface EstimatedPrice extends CommonPriceVisr {
  labors: LaborPrice[];
  additional_prices: AdditionPrice[];
}

export interface EstimateVisr {
  id: number;
  name_estimate: string;
  local_num: string;
  machine_num: string;
  chapter: number;

  estimated_prices: EstimatedPrice[];
}
export interface Visr {
  id: number;
  name_visr: string;
  type_work: string;
  visrs_id: string;
  total_cost: number;
  building_id: number;
}
export interface StructureVisrResponse extends Visr {
  estimates: EstimateVisr[];
}

export type IModalVisr = Omit<StructureVisrResponse, 'building_id'>;

export type OmitPos<T> = Omit<T, "pos">;

export interface RowData extends OmitPos<Partial<CommonPriceVisr>> {
  parentId: number | null;
  type_work?: string;
  numberData?: string;
  pos?: number | string;
}
