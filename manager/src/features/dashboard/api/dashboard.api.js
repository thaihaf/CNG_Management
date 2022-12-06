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
const getDashBoardByDay = (month, year) => {
  const subString = `?month=${month}&year=${year}`;
  const url = DashboardEndPoints.DASHBOARD_MANAGER.concat(subString);
  return api.get(url);
};
const getDashBoardByMonth = (year) => {
  const subString = `?year=${year}`;
  const url = DashboardEndPoints.DASHBOARD_MANAGER.concat(subString);
  return api.get(url);
};
const getDashBoardByYear = () => {
  const url = DashboardEndPoints.DASHBOARD_MANAGER;
  return api.get(url);
};

const dashboardApi = {
  getDashboardCustomerDaily,
  getDashBoardByDay,
  getDashBoardByMonth,
  getDashBoardByYear,
};
export default dashboardApi;
