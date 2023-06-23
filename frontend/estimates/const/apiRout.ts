const BASEURL = "http://127.0.0.1:8000";
const apiVersion = "/api/v1/";
// Все стройки
function generateRoute(endpoint: string, url = BASEURL, version = apiVersion) {
  const fullUrl = url + version + endpoint;
  return fullUrl;
}
export const allBuildingsRout = generateRoute("building/all");
export const buildingByIdRout = generateRoute("building/");
export const createBuildingRout = generateRoute("building/");
// ------------------//-------------//---------//-------------------
export const allConstructionsRout = generateRoute("construction/all");
export const createConstructionRout = generateRoute("construction/");
export const patchConstructionRout = generateRoute("construction/");
export const postImportFiles = generateRoute("import/");
export const postImportFilesConfirm = generateRoute("import/");
