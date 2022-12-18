import React from "react";

import { ProductManagerPaths } from "../constants/product-manager.paths";

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
  id: "product-list",
  path: ProductManagerPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Product Manager",
  roles: ["admin", "employee"],
  exact: true,
};
const CREATE_PRODUCT_SCREEN = {
  id: "create-product",
  path: ProductManagerPaths.CREATE_PRODUCT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product",
  roles: ["admin", "employee"],
  exact: true,
};
const PRODUCT_DETAILS_SCREEN = {
  id: "product-details",
  path: ProductManagerPaths.PRODUCT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Product Details",
  roles: ["admin", "employee"],
  exact: true,
};

const PRODUCT_MANAGER_ROUTES = [
  CREATE_PRODUCT_SCREEN,
  PRODUCT_DETAILS_SCREEN,
  PRODUCT_LIST_SCREEN,
];

export default PRODUCT_MANAGER_ROUTES;
