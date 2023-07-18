import { ErrorImportResponse } from "@/lib/api/acceptImport";

export function isError(obj: any): obj is FetchError {
  return "status" in obj;
}

export function isErrorImportResponse(
  obj: any
): obj is ErrorImportResponse {
  return "detail" in obj;
}
