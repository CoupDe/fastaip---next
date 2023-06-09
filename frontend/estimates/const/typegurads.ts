export function isError(obj: any): obj is FetchError {
  return "status" in obj;
}
