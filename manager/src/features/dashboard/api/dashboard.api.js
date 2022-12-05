import { api } from "api/api";
import { DashboardEndPoints } from "../dashboard";

const getDashboardCustomerDaily = (startDate, endDate) => {
  const rp1 = DashboardEndPoints.DASHBOARD_CUSTOMER_DAILY.replace(
    ":startDate",
    startDate
  );
  const url = rp1.replace(":endDate", endDate);
  return api.get(url);
};
const getCustomerDebtDetails = (id, startDate, endDate) => {
  const rp1 = DashboardEndPoints.CUSTOMER_DEBT_DETAILS.replace(":id", id);
  const rp2 = rp1.replace(":startDate", startDate);
  const url = rp2.replace(":endDate", endDate);
  return api.get(url);
};

const dashboardCustomerDailyApi = {
  getDashboardCustomerDaily,
  getCustomerDebtDetails,
};
export default dashboardCustomerDailyApi;
