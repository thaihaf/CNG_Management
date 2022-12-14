import { api } from "api/api";
import { CustomerDebtEndPoints } from "../customerDebt";

const getCustomerDebts = (params) => {
  const url = CustomerDebtEndPoints.CUSTOMER_DEBT;
  return api.get(url, { params });
};
const getCustomerDebtDetails = (id, startDate, endDate) => {
  const rp1 = CustomerDebtEndPoints.CUSTOMER_DEBT_DETAILS.replace(":id", id);
  const rp2 = rp1.replace(":startDate", startDate);
  const url = rp2.replace(":endDate", endDate);
  return api.get(url);
};

const customerDebtApi = {
  getCustomerDebts,
  getCustomerDebtDetails,
};
export default customerDebtApi;
