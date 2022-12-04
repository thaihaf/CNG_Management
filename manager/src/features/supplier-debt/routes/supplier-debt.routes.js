import React from "react";

import { SupplierDebtPaths } from "../constants/supplier-debt.paths";

const SupplierDebtListScreen = React.lazy(() =>
  import("../screens/SupplierDebtList/SupplierDebtList")
);
const DetailsSupplierDebtScreen = React.lazy(() =>
  import("../screens/DetailsSupplierDebt/DetailsSupplierDebt")
);

const SUPPLIER_DEBT_SCREEN = {
  id: "supplier-debt-list",
  path: SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
  component: SupplierDebtListScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Debt Manager",
};
const SUPPLIER_DEBT_DETAILS_SCREEN = {
  id: "supplier-debt-details",
  path: SupplierDebtPaths.SUPPLIER_DEBT_DETAILS,
  component: DetailsSupplierDebtScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Debt Details",
};

const SUPPLIER_DEBT_ROUTES = [
  SUPPLIER_DEBT_DETAILS_SCREEN,
  SUPPLIER_DEBT_SCREEN,
];

export default SUPPLIER_DEBT_ROUTES;
