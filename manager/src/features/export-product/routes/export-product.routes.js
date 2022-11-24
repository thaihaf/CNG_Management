import React from "react";

import { ProductExportManagerPaths } from "../constants/export-product.paths";

const DetailsProductExportScreen = React.lazy(() =>
  import("../screens/DetailsProductExport/DetailsProductExport")
);
const ListProductExportScreen = React.lazy(() =>
  import("../screens/ListProductExport/ListProductExport")
);
const CreateProductExportScreen = React.lazy(() =>
  import("../screens/CreateProductExport/CreateProductExport")
);

const DETAILS_PRODUCT_EXPORT_SCREEN = {
  id: "details-product-export",
  path: ProductExportManagerPaths.DETAILS_PRODUCT_EXPORT,
  component: DetailsProductExportScreen,
  isPrivateRoute: true,
  pageTitle: "Details Product Export",
};
const LIST_PRODUCT_EXPORT_SCREEN = {
  id: "list-product-export",
  path: ProductExportManagerPaths.LIST_PRODUCT_EXPORT,
  component: ListProductExportScreen,
  isPrivateRoute: true,
  pageTitle: "List Product Export",
};
const CREATE_PRODUCT_EXPORT_SCREEN = {
  id: "create-product-export",
  path: ProductExportManagerPaths.CREATE_PRODUCT_EXPORT,
  component: CreateProductExportScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product Export",
};

const PRODUCT_MANAGER_ROUTES = [
  DETAILS_PRODUCT_EXPORT_SCREEN,
  LIST_PRODUCT_EXPORT_SCREEN,
  CREATE_PRODUCT_EXPORT_SCREEN,];

export default PRODUCT_MANAGER_ROUTES;
