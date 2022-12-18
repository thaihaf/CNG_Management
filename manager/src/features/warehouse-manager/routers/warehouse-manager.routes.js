import React from "react";

import { WarehouseManagerPaths } from "../constants/warehouse-manager.paths";

const WarehouseListScreen = React.lazy(() =>
  import("../screens/WarehouseList/WarehouseList")
);
const WarehouseDetailsScreen = React.lazy(() =>
  import("../screens/WarehouseDetails/WarehouseDetails")
);
const WAREHOUSE_LIST_SCREEN = {
  id: "warehouse-list",
  path: WarehouseManagerPaths.WAREHOUSE_LIST,
  component: WarehouseListScreen,
  isPrivateRoute: true,
  pageTitle: "Warehouse Manager",
  roles: ["admin", "employee"],
  exact: true,
};
const WAREHOUSE_DETAILS_SCREEN = {
  id: "warehouse_id",
  path: WarehouseManagerPaths.WAREHOUSE_DETAIL,
  component: WarehouseDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Warehouse Detail",
  roles: ["admin", "employee"],
  exact: true,
};

const WAREHOUSE_MANAGER_ROUTES = [
  WAREHOUSE_LIST_SCREEN,
  WAREHOUSE_DETAILS_SCREEN,
];

export default WAREHOUSE_MANAGER_ROUTES;
