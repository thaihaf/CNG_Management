import { api } from "api/api";
import { ExportProductEndPoints } from "../constants/export-product.endpoints";

const getProductExportDetails = (id) => {
  const url = ExportProductEndPoints.PRODUCT_EXPORT_DETAILS.replace(
    ":exportId",
    id || ""
  );
  return api.get(url);
};
const createProductExport = (data) => {
  const url = ExportProductEndPoints.PRODUCT_EXPORT_MANAGER;
  return api.post(url, data);
};
const updateProductExports = (id, data) => {
  const url = ExportProductEndPoints.PRODUCT_EXPORT_DETAILS.replace(
    ":exportId",
    id || ""
  );
  return api.put(url, data);
};
const getAllProductExport = () => {
  const url = ExportProductEndPoints.PRODUCT_EXPORT_MANAGER;
  return api.get(url);
};
const deleteProductExport = (id) => {
  const url = ExportProductEndPoints.DELETE_PRODUCT_EXPORT.replace(
    ":id",
    id || ""
  );

  return api.delete(url);
};
const deleteProductExportDetail = (id) => {
  const url = ExportProductEndPoints.DELETE_DETAILS_PRODUCT_EXPORT.replace(
    ":id",
    id || ""
  );
  return api.delete(url);
};
const deleteProductExportDetailWarehouse = (id) => {
  const url = ExportProductEndPoints.DELETE_WAREHOUSE_PRODUCT_EXPORT.replace(
    ":id",
    id || ""
  );
  return api.delete(url);
};

const exportProductApi = {
  createProductExport,
  updateProductExports,
  getAllProductExport,
  getProductExportDetails,
  deleteProductExport,
  deleteProductExportDetail,
  deleteProductExportDetailWarehouse,
};
export default exportProductApi;
