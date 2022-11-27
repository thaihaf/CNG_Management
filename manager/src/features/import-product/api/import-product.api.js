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
const deleteProductImport = (id) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_DETAILS.replace(
    ":importId",
    id || ""
  );
  return api.delete(url);
};
const deleteProductImportDetail = (id) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_DETAIL.replace(
    ":detailId",
    id || ""
  );
  return api.delete(url);
};
const deleteProductImportDetailWarehouse = (id) => {
  const url = ImportProductEndPoints.PRODUCT_IMPORT_DETAIL_WAREHOUSE.replace(
    ":id",
    id || ""
  );
  return api.delete(url);
};

const importProductApi = {
  createProductImport,
  updateProductImports,
  getAllProductImport,
  getProductImportDetails,
  deleteProductImport,
  deleteProductImportDetail,
  deleteProductImportDetailWarehouse,
};
export default importProductApi;
