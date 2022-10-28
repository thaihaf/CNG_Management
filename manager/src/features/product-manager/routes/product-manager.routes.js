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
const DetailsProductImportScreen = React.lazy(() =>
  import("../screens/ImportProduct/DetailsProductImport/DetailsProductImport")
);
const ListProductImportScreen = React.lazy(() =>
  import("../screens/ImportProduct/ListProductImport/ListProductImport")
);
const CreateProductImportScreen = React.lazy(() =>
  import("../screens/ImportProduct/CreateProductImport/CreateProductImport")
);

const PRODUCT_LIST_SCREEN = {
  id: "product-list",
  path: ProductManagerPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Product Manager",
};
const CREATE_PRODUCT_SCREEN = {
  id: "create-product",
  path: ProductManagerPaths.CREATE_PRODUCT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product",
};
const PRODUCT_DETAILS_SCREEN = {
  id: "product-details",
  path: ProductManagerPaths.PRODUCT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Product Details",
};

const DETAILS_PRODUCT_IMPORT_SCREEN = {
  id: "details-product-import",
  path: ProductManagerPaths.DETAILS_PRODUCT_IMPORT,
  component: DetailsProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "Details Product Import",
};
const LIST_PRODUCT_IMPORT_SCREEN = {
  id: "list-product-import",
  path: ProductManagerPaths.LIST_PRODUCT_IMPORT,
  component: ListProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "List Product Import",
};
const CREATE_PRODUCT_IMPORT_SCREEN = {
  id: "create-product-import",
  path: ProductManagerPaths.CREATE_PRODUCT_IMPORT,
  component: CreateProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product Import",
};

const PRODUCT_MANAGER_ROUTES = [
  CREATE_PRODUCT_SCREEN,
  PRODUCT_DETAILS_SCREEN,
  PRODUCT_LIST_SCREEN,
  DETAILS_PRODUCT_IMPORT_SCREEN,
  LIST_PRODUCT_IMPORT_SCREEN,
  CREATE_PRODUCT_IMPORT_SCREEN,
];

export default PRODUCT_MANAGER_ROUTES;
