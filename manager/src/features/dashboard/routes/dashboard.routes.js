import React from "react";

import { DashboardPaths } from "../constants/dashboard.paths";

const CustomerDailyListScreen = React.lazy(() =>
  import("../screens/CustomerDailyList/CustomerDailyList")
);
// const DetailsCustomerDebtScreen = React.lazy(() =>
//   import("../screens/DetailsCustomerDebt/DetailsCustomerDebt")
// );

const DASHBOARD = {
  id: "dashboard",
  isRoot: true,
  path2: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  isPrivateRoute: true,
};
const DASHBOARD_CUSTOMER = {
  id: "dashboard-customer",
  isRoot: true,
  path2: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  isPrivateRoute: true,
};
const CUSTOMER_DAILY_LIST_SCREEN = {
  id: "dashboard-customer-daily-list",
  path: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  component: CustomerDailyListScreen,
  isPrivateRoute: true,
  pageTitle: "Dashboard Daily",
};
// const CUSTOMER_DEBT_DETAILS_SCREEN = {
//   id: "customer-debt-details",
//   path: DashboardPaths.CUSTOMER_DEBT_DETAILS,
//   component: DetailsCustomerDebtScreen,
//   isPrivateRoute: true,
//   pageTitle: "Customer Debt Details",
// };

const DASHBOARD_ROUTES = [
  CUSTOMER_DAILY_LIST_SCREEN,
  // DASHBOARD,
  // DASHBOARD_CUSTOMER,
  // CUSTOMER_DEBT_DETAILS_SCREEN,
];

export default DASHBOARD_ROUTES;
