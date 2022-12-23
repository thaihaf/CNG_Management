import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { SupplierManagerPaths } from "../constants/supplier-manager.paths";

const SupplierListScreen = React.lazy(() =>
  import("../screens/SupplierList/SupplierList")
);
const SupplierDetailsScreen = React.lazy(() =>
  import("../screens/SupplierDetails/SupplierDetails")
);
const SUPPLIER_LIST_SCREEN = {
  id: "supplier-list",
  path: SupplierManagerPaths.SUPPLIER_LIST,
  component: SupplierListScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Nhà cung cấp",
      icon: null,
      path: SupplierManagerPaths.SUPPLIER_LIST,
      visible: false,
    },
  ],
};

const SUPPLIER_DETAILS_SCREEN = {
  id: "supplier_id",
  path: SupplierManagerPaths.SUPPLIER_DETAIL,
  component: SupplierDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Detail",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Nhà cung cấp",
      icon: null,
      path: SupplierManagerPaths.SUPPLIER_LIST,
      visible: true,
    },
    {
      label: "Chi tiết Nhà cung cấp",
      icon: null,
      path: SupplierManagerPaths.SUPPLIER_DETAIL,
      visible: false,
    },
  ],
};

const SUPPLIER_MANAGER_ROUTES = [SUPPLIER_LIST_SCREEN, SUPPLIER_DETAILS_SCREEN];

export default SUPPLIER_MANAGER_ROUTES;
