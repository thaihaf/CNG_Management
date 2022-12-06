import React from "react";

import { DashboardPaths } from "../constants/dashboard.paths";

const DailyReport = React.lazy(() =>
  import("../screens/DailyReport/DailyReport")
);
const Dashboard = React.lazy(() => import("../screens/Dashboard/Dashboard"));

const DASHBOARD = {
  id: "dashboard",
  path: DashboardPaths.DASHBOARD_MANAGER,
  component: Dashboard,
  isPrivateRoute: true,
  pageTitle: "Thống kê",
};
const CUSTOMER_DAILY_LIST_SCREEN = {
  id: "dashboard-customer-daily-list",
  path: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  component: DailyReport,
  isPrivateRoute: true,
  pageTitle: "Báo cáo hàng ngày",
};
const DASHBOARD_CUSTOMER = {
  id: "dashboard-customer",
  isRoot: true,
  path2: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  isPrivateRoute: true,
};

const DASHBOARD_ROUTES = [CUSTOMER_DAILY_LIST_SCREEN, DASHBOARD];

export default DASHBOARD_ROUTES;
