export interface ILoginRequest {
  username: string;
  password: string;
}

interface CommonPriceVisr {
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
interface LaborPrice extends CommonPriceVisr {
  category: Category;
}
interface AdditionPrice {
  pos: number;
  name: Addition;
  total_cost: number;
}

interface EstimatedPrice extends CommonPriceVisr {
  labors: LaborPrice[];
  additional_prices: AdditionPrice[];
}

interface EstimateVisr extends EstimatedPrice {
  name_estimate: string;
  local_num: string;
  machine_num: string;
  chapter: number;
  estimated_prices: EstimatedPrice[];
}

export interface StructureVisrResponse extends EstimateVisr {
  name_visr: string;
  type_work: string;
  total_cost: number;
  building_id: number;
  estimates: EstimateVisr[];
}
