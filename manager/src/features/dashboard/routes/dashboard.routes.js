import React from "react";

import { DashboardPaths } from "../constants/dashboard.paths";

const DailyReport = React.lazy(() =>
  import("../screens/DailyReport/DailyReport")
);
const DashboardScreen = React.lazy(() =>
  import("../screens/Dashboard/Dashboard")
);
const InventoryScreen = React.lazy(() =>
  import("../screens/Inventory/Inventory")
);
const ProfitScreen = React.lazy(() => import("../screens/Profit/Profit"));

const DASHBOARD = {
  id: "dashboard",
  path: DashboardPaths.DASHBOARD_MANAGER,
  component: DashboardScreen,
  isPrivateRoute: true,
  pageTitle: "Thống kê",
  roles: ["admin"],
  exact: true,
};

// inventory
const PRODUCT_INVENTORY = {
  id: "inventory-product",
  path: DashboardPaths.PRODUCT_INVENTORY,
  component: InventoryScreen,
  isPrivateRoute: true,
  pageTitle: "Tồn kho",
  roles: ["admin"],
  exact: true,
};
const SUPPLIER_INVENTORY = {
  id: "inventory-supplier",
  path: DashboardPaths.SUPPLIER_INVENTORY,
  component: InventoryScreen,
  isPrivateRoute: true,
  pageTitle: "Tồn kho",
  roles: ["admin"],
  exact: true,
};
const CATEGORY_INVENTORY = {
  id: "inventory-category",
  path: DashboardPaths.CATEGORY_INVENTORY,
  component: InventoryScreen,
  isPrivateRoute: true,
  pageTitle: "Tồn kho",
  roles: ["admin"],
  exact: true,
};
const WAREHOUSE_INVENTORY = {
  id: "inventory-warehouse",
  path: DashboardPaths.WAREHOUSE_INVENTORY,
  component: InventoryScreen,
  isPrivateRoute: true,
  pageTitle: "Tồn kho",
  roles: ["admin"],
  exact: true,
};

// profit
const PRODUCT_PROFIT = {
  id: "profit-product",
  path: DashboardPaths.PRODUCT_PROFIT,
  component: ProfitScreen,
  isPrivateRoute: true,
  pageTitle: "Lợi nhuận",
  roles: ["admin"],
  exact: true,
};
const SUPPLIER_PROFIT = {
  id: "profit-supplier",
  path: DashboardPaths.SUPPLIER_PROFIT,
  component: ProfitScreen,
  isPrivateRoute: true,
  pageTitle: "Lợi nhuận",
  roles: ["admin"],
  exact: true,
};
const CATEGORY_PROFIT = {
  id: "profit-warehouse",
  path: DashboardPaths.CATEGORY_PROFIT,
  component: ProfitScreen,
  isPrivateRoute: true,
  pageTitle: "Lợi nhuận",
  roles: ["admin"],
  exact: true,
};
const CUSTOMER_PROFIT = {
  id: "profit-customer",
  path: DashboardPaths.CUSTOMER_PROFIT,
  component: ProfitScreen,
  isPrivateRoute: true,
  pageTitle: "Lợi nhuận",
  roles: ["admin"],
  exact: true,
};
const EMPLOYEE_PROFIT = {
  id: "profit-employee",
  path: DashboardPaths.EMPLOYEE_PROFIT,
  component: ProfitScreen,
  isPrivateRoute: true,
  pageTitle: "Lợi nhuận",
  roles: ["admin"],
  exact: true,
};

// daily report
const CUSTOMER_DAILY_LIST_SCREEN = {
  id: "dashboard-customer-daily-list",
  path: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  component: DailyReport,
  isPrivateRoute: true,
  pageTitle: "Báo cáo hàng ngày",
  roles: ["admin"],
  exact: true,
};
const DASHBOARD_CUSTOMER = {
  id: "dashboard-customer",
  isRoot: true,
  path2: DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
  roles: ["admin"],
  exact: true,
};

const DASHBOARD_ROUTES = [
  CUSTOMER_DAILY_LIST_SCREEN,
  DASHBOARD,
  WAREHOUSE_INVENTORY,
  CATEGORY_INVENTORY,
  SUPPLIER_INVENTORY,
  PRODUCT_INVENTORY,
  PRODUCT_PROFIT,
  SUPPLIER_PROFIT,
  CATEGORY_PROFIT,
  CUSTOMER_PROFIT,
  EMPLOYEE_PROFIT,
];

export default DASHBOARD_ROUTES;
