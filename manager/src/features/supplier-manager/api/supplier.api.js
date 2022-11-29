import { api } from "api/api";
import { SupplierEndPoints } from "../supplierManager";

const getSuppliers = () => {
  const url = SupplierEndPoints.SUPPLIER_MANAGER;
  return api.get(url);
};
const getActiveSuppliers = () => {
  const url = SupplierEndPoints.SUPPLIER_ACTIVE;
  return api.get(url);
};
const createDetails = (data) => {
  const url = SupplierEndPoints.SUPPLIER_MANAGER;
  return api.post(url, data);
};
const getSupplierDetails = (id) => {
  const url = SupplierEndPoints.SUPPLIER_DETAIL.replace(
    ":supplierId",
    id || ""
  );
  return api.get(url);
};
const updateDetails = (id, data) => {
  const url = SupplierEndPoints.SUPPLIER_DETAIL.replace(
    ":supplierId",
    id || ""
  );
  return api.put(url, data);
};
const deleteSupplier = (id) => {
  const url = SupplierEndPoints.SUPPLIER_DETAIL.replace(
    ":supplierId",
    id || ""
  );
  return api.delete(url);
};

// debt
const getDebtSuppliers = () => {
  const url = SupplierEndPoints.DEBT_MANAGER;
  return api.get(url);
};
const getDeptSupplierDetails = (id) => {
  const url = SupplierEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.get(url);
};
const createDeptSupplier = (data) => {
  const url = SupplierEndPoints.DEBT_MANAGER;
  console.log(data)
  return api.post(url, data);
};
const updateDeptSupplier = (id, data) => {
  const url = SupplierEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.put(url, data);
};
const deleteDeptSupplier = (id) => {
  const url = SupplierEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.delete(url);
};
const supplierApi = {
  getSuppliers,
  getActiveSuppliers,
  getSupplierDetails,
  createDetails,
  updateDetails,
  deleteSupplier,
  getDebtSuppliers,
  getDeptSupplierDetails,
  deleteDeptSupplier,
  updateDeptSupplier,
  createDeptSupplier,
};
export default supplierApi;
