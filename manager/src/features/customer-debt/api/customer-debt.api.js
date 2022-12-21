import { api } from "api/api";
import { CustomerDebtEndPoints } from "../customerDebt";

const getCustomerDebts = (params) => {
  const url = CustomerDebtEndPoints.CUSTOMER_DEBT;
  return api.get(url, { params });
};
const getCustomerDebtDetails = (id, params) => {
  const url = CustomerDebtEndPoints.CUSTOMER_DEBT_DETAILS.replace(":id", id);
  return api.get(url, { params });
};

const customerDebtApi = {
  getCustomerDebts,
  getCustomerDebtDetails,
};
export default customerDebtApi;
