import React from "react";

import { SupplierManagerPaths } from "../constants/supplier-manager.paths";

const SupplierListScreen = React.lazy(() =>
  import("../screens/SupplierList/SupplierList")
);
// const CreateSupplier = React.lazy(() =>
//   import("../screens/CreateSupplier/CreateSupplier")
// );
const SupplierDetailsScreen = React.lazy(() =>
  import("../screens/SupplierDetails/SupplierDetails")
);
// const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
const SUPPLIER_LIST_SCREEN = {
  id: "supplier-list",
  path: SupplierManagerPaths.SUPPLIER_LIST,
  component: SupplierListScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Manager",
};
// const SUPPLIER_CREATE_SCREEN = {
//   id: "supplier-create",
//   path: SupplierManagerPaths.CREATE_SUPPLIER,
//   component: CreateSupplier,
//   isPrivateRoute: true,
//   pageTitle: "Supplier Create",
// };
const SUPPLIER_DETAILS_SCREEN = {
  id: "supplier_id",
  path: SupplierManagerPaths.SUPPLIER_DETAIL,
  component: SupplierDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Detail",
};

const SUPPLIER_MANAGER_ROUTES = [
  SUPPLIER_LIST_SCREEN, 
  // SUPPLIER_CREATE_SCREEN,
  SUPPLIER_DETAILS_SCREEN,
];

export default SUPPLIER_MANAGER_ROUTES;
