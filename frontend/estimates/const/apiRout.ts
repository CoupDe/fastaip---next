const BASEURL = "http://127.0.0.1:8000";
const apiVersion = "/api/v1/";
// Все стройки
function generateRoute(endpoint: string, url = BASEURL, version = apiVersion) {
  const fullUrl = url + version + endpoint;
  return fullUrl;
}

export const allProjects = generateRoute("construction/all");
export const allBuildings = generateRoute("building/all");
export const buildingById = generateRoute("building/");
