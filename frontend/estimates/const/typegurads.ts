export function isError(obj: any): obj is FetchError {
    console.log(obj)
  console.log("status" in obj);
  return "status" in obj ;
}
