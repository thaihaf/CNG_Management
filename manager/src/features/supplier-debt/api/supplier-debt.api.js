import { api } from "api/api";
import { SupplierDebtEndPoints } from "../supplierDebt";

const getSupplierDebts = (startDate, endDate) => {
  const rp1 = SupplierDebtEndPoints.SUPPLIER_DEBT.replace(
    ":startDate",
    startDate
  );
  const url = rp1.replace(":endDate", endDate);
  return api.get(url);
};
const getSupplierDebtDetails = (id, startDate, endDate) => {
  const rp1 = SupplierDebtEndPoints.SUPPLIER_DEBT_DETAILS.replace(":id", id);
  const rp2 = rp1.replace(":startDate", startDate);
  const url = rp2.replace(":endDate", endDate);
  return api.get(url);
};

const supplierDebtApi = {
  getSupplierDebts,
  getSupplierDebtDetails,
};
export default supplierDebtApi;
