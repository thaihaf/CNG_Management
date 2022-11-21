import { api } from "api/api";
import { ImportProductEndPoints } from "../constants/import-product.endpoints";

const getProductImportDetails = (id) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_DETAILS.replace(
    ":importId",
    id || ""
  );
  return api.get(url);
};
const createProductImport = (data) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_MANAGER;
  return api.post(url, data);
};
const updateProductImports = (id, data) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_DETAILS.replace(
    ":importId",
    id || ""
  );
  return api.put(url, data);
};
const getAllProductImport = () => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_MANAGER;
  return api.get(url);
};

const importProductApi = {
  createProductImport,
  updateProductImports,
  getAllProductImport,
  getProductImportDetails,
};
export default importProductApi;
