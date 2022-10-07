import React from "react";
import { SupplierManagerPaths } from "../constants/supplier-manager.paths";

const SupplierList = React.lazy(() =>
  import("../screens/SupplierList/SupplierList")
);
const CreateSupplier = React.lazy(() =>
  import("../screens/CreateSupplier/CreateSupplier")
);

const SUPPLIER_LIST_SCREEN = {
  id: "supplier-list",
  path: SupplierManagerPaths.SUPPLIER_LIST,
  component: SupplierList,
  isPrivateRoute: true,
  pageTitle: "Supplier Manager",
};
const SUPPLIER_CREATE_SCREEN = {
  id: "supplier-create",
  path: SupplierManagerPaths.CREATE_SUPPLIER,
  component: CreateSupplier,
  isPrivateRoute: true,
  pageTitle: "Supplier Create",
};

const SUPPLIER_MANAGER_ROUTES = [SUPPLIER_LIST_SCREEN, SUPPLIER_CREATE_SCREEN];

export default SUPPLIER_MANAGER_ROUTES;
