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

const PRODUCT_LIST_SCREEN = {
  id: "supplier-debt-list",
  path: SupplierDebtPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Product Manager",
};
const CREATE_PRODUCT_SCREEN = {
  id: "create-supplier-debt",
  path: SupplierDebtPaths.CREATE_PRODUCT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product",
};
const PRODUCT_DETAILS_SCREEN = {
  id: "supplier-debt-details",
  path: SupplierDebtPaths.PRODUCT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Product Details",
};

const SUPPLIER_DEBT_ROUTES = [
  CREATE_PRODUCT_SCREEN,
  PRODUCT_DETAILS_SCREEN,
  PRODUCT_LIST_SCREEN,
];

export default SUPPLIER_DEBT_ROUTES;
