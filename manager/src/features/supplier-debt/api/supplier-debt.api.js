import { api } from "api/api";
import { SupplierDebtEndPoints } from "../supplierDebt";

const getSupplierDebts = (params) => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT;
  return api.get(url, { params });
};
const getSupplierDebtDetails = (id, params) => {
  const url = SupplierDebtEndPoints.SUPPLIER_DEBT_DETAILS.replace(":id", id);
  return api.get(url, { params });
};

const supplierDebtApi = {
  getSupplierDebts,
  getSupplierDebtDetails,
};
export default supplierDebtApi;
