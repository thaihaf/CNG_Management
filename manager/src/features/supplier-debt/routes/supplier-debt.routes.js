import React from "react";

import { SupplierDebtPaths } from "../constants/supplier-debt.paths";

const ProductListScreen = React.lazy(() =>
  import("../screens/ProductList/ProductList")
);
const CreateProductScreen = React.lazy(() =>
  import("../screens/CreateProduct/CreateProduct")
);
const ProductDetailsScreen = React.lazy(() =>
  import("../screens/ProductDetails/ProductDetails")
);

const SUPPLIER_LIST_SCREEN = {
  id: "list-supplier-debt",
  path: SupplierDebtPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Debt List",
};
const CREATE_SUPPLIER_SCREEN = {
  id: "supplier-debt-create",
  path: SupplierDebtPaths.CREATE_PRODUCT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Supplier Debt Product",
};
const SUPPLIER_DETAILS_SCREEN = {
  id: "supplier-debt-details",
  path: SupplierDebtPaths.PRODUCT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Debt Details",
};

const SUPPLIER_DEBT_ROUTES = [
  CREATE_SUPPLIER_SCREEN,
  SUPPLIER_DETAILS_SCREEN,
  SUPPLIER_LIST_SCREEN,
];

export default SUPPLIER_DEBT_ROUTES;
