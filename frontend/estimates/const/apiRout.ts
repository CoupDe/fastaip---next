const BASEURL = "http://127.0.0.1:8000";
const apiVersion = "/api/v1/";
// Все стройки
function generateRoute(endpoint: string, url = BASEURL, version = apiVersion) {
  const fullUrl = url + version + endpoint;
  return fullUrl;
}

export const allProjectsRout = generateRoute("construction/all");
export const allBuildingsRout = generateRoute("building/all");
export const buildingByIdRout = generateRoute("building/");
export const createConstructionRout = generateRoute("construction/");
