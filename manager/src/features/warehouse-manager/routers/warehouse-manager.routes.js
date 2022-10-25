import React from "react";

import { WarehouseManagerPaths } from "../constants/warehouse-manager.paths";

const WarehouseListScreen = React.lazy(() =>
  import("../screens/WarehouseList/WarehouseList")
);
// const CreateSupplier = React.lazy(() =>
//   import("../screens/CreateSupplier/CreateSupplier")
// );
const WarehouseDetailsScreen = React.lazy(() =>
  import("../screens/WarehouseDetails/WarehouseDetails")
);
// const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
const WAREHOUSE_LIST_SCREEN = {
  id: "warehouse-list",
  path: WarehouseManagerPaths.WAREHOUSE_LIST,
  component: WarehouseListScreen,
  isPrivateRoute: true,
  pageTitle: "Warehouse Manager",
};
// const SUPPLIER_CREATE_SCREEN = {
//   id: "supplier-create",
//   path: SupplierManagerPaths.CREATE_SUPPLIER,
//   component: CreateSupplier,
//   isPrivateRoute: true,
//   pageTitle: "Supplier Create",
// };
const WAREHOUSE_DETAILS_SCREEN = {
  id: "warehouse_id",
  path: WarehouseManagerPaths.WAREHOUSE_DETAIL,
  component: WarehouseDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Warehouse Detail",
};

const WAREHOUSE_MANAGER_ROUTES = [
  WAREHOUSE_LIST_SCREEN, 
  // SUPPLIER_CREATE_SCREEN,
  WAREHOUSE_DETAILS_SCREEN,
];

export default WAREHOUSE_MANAGER_ROUTES;
