import { api } from "api/api";
import { DashboardEndPoints } from "../dashboard";

const getDashboardCustomerDaily = (params) => {
  let url = DashboardEndPoints.DASHBOARD_CUSTOMER_DAILY;
  return api.get(url, { params });
};

// dashboard
const getDashBoardByDay = (month, year) => {
  const subString = `?month=${month}&year=${year}&size=31`;
  const url = DashboardEndPoints.DASHBOARD_MANAGER.concat(subString);
  return api.get(url);
};
const getDashBoardByMonth = (year) => {
  const subString = `?year=${year}`;
  const url = DashboardEndPoints.DASHBOARD_MANAGER.concat(subString);
  return api.get(url);
};
const getDashBoardByYear = (startYear, endYear) => {
  const subString = `?start=${startYear}&end=${endYear}`;
  const url = DashboardEndPoints.DASHBOARD_MANAGER.concat(subString);
  return api.get(url);
};
const getCustomerDebtDashboard = () => {
  const url = DashboardEndPoints.DASHBOARD_DEBT_CUSTOMER;
  return api.get(url);
};
const getSupplierDebtDashboard = () => {
  const url = DashboardEndPoints.DASHBOARD_DEBT_SUPPLIER;
  return api.get(url);
};
const getDashboardTotal = () => {
  const url = DashboardEndPoints.DASHBOARD_TOTAL;
  return api.get(url);
};

// inventory
const getProductInventory = (params) => {
  const url = DashboardEndPoints.PRODUCT_INVENTORY;
  return api.get(url, { params });
};
const getCategoryInventory = (params) => {
  const url = DashboardEndPoints.CATEGORY_INVENTORY;
  return api.get(url, { params });
};
const getSupplierInventory = (params) => {
  const url = DashboardEndPoints.SUPPLIER_INVENTORY;
  return api.get(url, { params });
};
const getWarehouseInventory = (params) => {
  const url = DashboardEndPoints.WAREHOUSE_INVENTORY;
  return api.get(url, { params });
};

// profit
const getProductProfit = (params) => {
  const url = DashboardEndPoints.PRODUCT_PROFIT;
  return api.get(url, { params });
};
const getCustomerProfit = (params) => {
  const url = DashboardEndPoints.CUSTOMER_PROFIT;
  return api.get(url, { params });
};
const getEmployeeProfit = (params) => {
  const url = DashboardEndPoints.EMPLOYEE_PROFIT;
  return api.get(url, { params });
};
const getSupplierProfit = (params) => {
  const url = DashboardEndPoints.SUPPLIER_PROFIT;
  return api.get(url, { params });
};
const getCategoryProfit = (params) => {
  const url = DashboardEndPoints.CATEGORY_PROFIT;
  return api.get(url, { params });
};


const dashboardApi = {
  //dashboard
  getDashboardTotal,
  getCustomerDebtDashboard,
  getSupplierDebtDashboard,

  //daily
  getDashboardCustomerDaily,

  // dashboard
  getDashBoardByDay,
  getDashBoardByMonth,
  getDashBoardByYear,

  //inventory
  getProductInventory,
  getCategoryInventory,
  getSupplierInventory,
  getWarehouseInventory,

  //profit
  getProductProfit,
  getCustomerProfit,
  getEmployeeProfit,
  getSupplierProfit,
  getCategoryProfit,
};
export default dashboardApi;
