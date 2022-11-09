import { api } from "api/api";
import { ImportProductEndPoints } from "../importProduct";

const createProductImport = (data) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_MANAGER;
  return api.post(url, data);
};

const importProductApi = {
  createProductImport,
};
export default importProductApi;
