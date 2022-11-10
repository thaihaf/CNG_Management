import { api } from "api/api";
import { ImportProductEndPoints } from "../importProduct";

const createProductImport = (data) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_MANAGER;
  return api.post(url, data);
};
const getAllProductImport = () => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_MANAGER;
  return api.get(url);
};

const importProductApi = {
  createProductImport,
  getAllProductImport,
};
export default importProductApi;
