import { ErrorImportResponse } from "@/lib/api/postAcceptImport";
import { EstimateVisr, EstimatedPrice, StructureVisrResponse } from "./interfaces";

export function isError(obj: any): obj is FetchError {
  return "status" in obj;
}

export function isErrorImportResponse(obj: any): obj is ErrorImportResponse {
  return "detail" in obj;
}

export function isVisr(obj: any): obj is StructureVisrResponse {
  return "name_visr" in obj && "estimates" in obj;
}

export function isEstimate(obj: any): obj is EstimateVisr {
  return "name_estimate" in obj && "estimated_prices" in obj;
}
export function isEstimatedPrice(obj: any): obj is EstimatedPrice {
  return "labors" in obj && "additional_prices" in obj;
}