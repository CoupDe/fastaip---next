const BASEURL = "http://127.0.0.1:8000";
const apiVersion = "/api/v1/";
// Все стройки
function generateRoute(endpoint: string) {
  return (id?: string, param?: string) => {
    return `${BASEURL}${apiVersion}${endpoint}${id ? `${id}` : ""}${
      param ? `/${param}` : ""
    }`;
  };
}
//-------------------//-building-//---------//-----------------------
export const allBuildingsRout = generateRoute("building/all");
export const buildingByIdRout = generateRoute("building/");
export const createBuildingRout = generateRoute("building/");
//-------------------//-Construction-//---------//-------------------
export const allConstructionsRout = generateRoute("construction/all");
export const createConstructionRout = generateRoute("construction/");
export const patchConstructionRout = generateRoute("construction/");
//-------------------//-Import-//---------//--------------------
export const postImportVIsrRout = generateRoute("import/visr/");
export const postImportFilesConfirmRout = generateRoute("import/visr/");
export const postImportFormRout = generateRoute("import/form/");
//-------------------//-Structure_VISR-//---------//-----------------
export const getAllBuildingsVisrRout = generateRoute("building/");
export const getVisrByIdRout = generateRoute("building/");
//-------------------//-Form-data-//---------//-----------------
export const getAllFormDataRout = generateRoute("form/");
//-------------------//-Synch-Visr_Form-data-//---------//-----------------
export const postSynchVisrForms = generateRoute("synch/");
