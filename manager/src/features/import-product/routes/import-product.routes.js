import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { ImportProductManagerPaths } from "../constants/import-product.paths";

const DetailsProductImportScreen = React.lazy(() =>
  import("../screens/DetailsProductImport/DetailsProductImport")
);
const ListProductImportScreen = React.lazy(() =>
  import("../screens/ListProductImport/ListProductImport")
);
const CreateProductImportScreen = React.lazy(() =>
  import("../screens/CreateProductImport/CreateProductImport")
);

const DETAILS_PRODUCT_IMPORT_SCREEN = {
  id: "details-product-import",
  path: ImportProductManagerPaths.DETAILS_PRODUCT_IMPORT,
  component: DetailsProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "Details Product Import",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Đơn xuất",
      icon: null,
      path: ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
      visible: true,
    },
    {
      label: "Chi tiết Đơn xuất",
      icon: null,
      path: ImportProductManagerPaths.DETAILS_PRODUCT_IMPORT,
      visible: false,
    },
  ],
};
const LIST_PRODUCT_IMPORT_SCREEN = {
  id: "list-product-import",
  path: ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
  component: ListProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "List Product Import",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Đơn xuất",
      icon: null,
      path: ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
      visible: false,
    },
  ],
};
const CREATE_PRODUCT_IMPORT_SCREEN = {
  id: "create-product-import",
  path: ImportProductManagerPaths.CREATE_PRODUCT_IMPORT,
  component: CreateProductImportScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product Import",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Đơn xuất",
      icon: null,
      path: ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
      visible: true,
    },
    {
      label: "Chi tiết Đơn xuất",
      icon: null,
      path: ImportProductManagerPaths.CREATE_PRODUCT_IMPORT,
      visible: false,
    },
  ],
};

const PRODUCT_MANAGER_ROUTES = [
  DETAILS_PRODUCT_IMPORT_SCREEN,
  LIST_PRODUCT_IMPORT_SCREEN,
  CREATE_PRODUCT_IMPORT_SCREEN,
];

export default PRODUCT_MANAGER_ROUTES;
