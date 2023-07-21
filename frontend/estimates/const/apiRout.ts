const BASEURL = "http://127.0.0.1:8000";
const apiVersion = "/api/v1/";
// Все стройки
function generateRoute(
  endpoint: string,
  url = BASEURL,
  id?: string,
  version = apiVersion
) {
  const fullUrl = url + version + endpoint;
  return fullUrl;
}
//-------------------//-building-//---------//-----------------------
export const allBuildingsRout = generateRoute("building/all");
export const buildingByIdRout = generateRoute("building/");
export const createBuildingRout = generateRoute("building/");
//-------------------//-Construction-//---------//-------------------
export const allConstructionsRout = generateRoute("construction/all");
export const createConstructionRout = generateRoute("construction/");
export const patchConstructionRout = generateRoute("construction/");
//-------------------//-Import_VISR-//---------//--------------------
export const postImportFilesRout = generateRoute("import/");
export const postImportFilesConfirmRout = generateRoute("import/");
//-------------------//-Structure_VISR-//---------//-----------------
export const getAllBuildingsVisrRout = generateRoute;
