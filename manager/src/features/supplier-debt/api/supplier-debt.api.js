import { api } from "api/api";
import { SupplierDebtEndPoints } from "../supplierDebt";

const getSupplierDebts = () => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT;
  return api.get(url);
};
const getSupplierDebtDetails = (id) => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT_DETAILS.replace(
    ":id",
    id || ""
  );
  return api.get(url);
};
const createSupplierDebts = (data) => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT;
  return api.post(url, data);
};
const updateSupplierDebts = (id, data) => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT_DETAILS.replace(
    ":id",
    id || ""
  );
  return api.put(url, data);
};

const SupplierDebtApi = {
  getSupplierDebts,
  createSupplierDebts,
  updateSupplierDebts,
  getSupplierDebtDetails,
};
export default SupplierDebtApi;
