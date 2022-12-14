import { api } from "api/api";
import { WarehouseEndPoints } from "../warehouseManager";

const getWarehouses = (params) => {
  const url = WarehouseEndPoints.WAREHOUSE_MANAGER;
  return api.get(url, { params });
};
const createDetails = (data) => {
  const url = WarehouseEndPoints.WAREHOUSE_MANAGER;
  return api.post(url, data);
};
const getWarehouseDetails = (id) => {
  const url = WarehouseEndPoints.WAREHOUSE_DETAIL.replace(
    ":warehouseId",
    id || ""
  );
  return api.get(url);
};
const updateDetails = (id, data) => {
  const url = WarehouseEndPoints.WAREHOUSE_DETAIL.replace(
    ":warehouseId",
    id || ""
  );
  return api.put(url, data);
};
const deleteWarehouse = (id) => {
  const url = WarehouseEndPoints.WAREHOUSE_DETAIL.replace(
    ":warehouseId",
    id || ""
  );
  return api.delete(url);
};
const warehouseApi = {
  getWarehouses,
  getWarehouseDetails,
  createDetails,
  updateDetails,
  deleteWarehouse,
};
export default warehouseApi;
