import { api } from "api/api";
import { CustomerDebtEndPoints } from "../customerDebt";

const getCustomerDebts = (startDate, endDate) => {
  const rp1 = CustomerDebtEndPoints.CUSTOMER_DEBT.replace(
    ":startDate",
    startDate
  );
  const url = rp1.replace(":endDate", endDate);
  return api.get(url);
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
