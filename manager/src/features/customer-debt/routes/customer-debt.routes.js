import React from "react";

import { CustomerDebtPaths } from "../constants/customer-debt.paths";

const ProductListScreen = React.lazy(() =>
  import("../screens/ProductList/ProductList")
);
const CreateProductScreen = React.lazy(() =>
  import("../screens/CreateProduct/CreateProduct")
);
const ProductDetailsScreen = React.lazy(() =>
  import("../screens/ProductDetails/ProductDetails")
);

const CUSTOMER_DEBT_SCREEN = {
  id: "customer-debt-list",
  path: CustomerDebtPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Debt Manager",
};
const CREATE_CUSTOMER_DEBT_SCREEN = {
  id: "create-customer-debt",
  path: CustomerDebtPaths.CREATE_CUSTOMER_DEBT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Customer Debt",
};
const CUSTOMER_DEBT_DETAILS_SCREEN = {
  id: "customer-debt-details",
  path: CustomerDebtPaths.CUSTOMER_DEBT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Debt Details",
};

const CUSTOMER_DEBT_ROUTES = [
  CREATE_CUSTOMER_DEBT_SCREEN,
  CUSTOMER_DEBT_DETAILS_SCREEN,
  CUSTOMER_DEBT_SCREEN,
];

export default CUSTOMER_DEBT_ROUTES;
