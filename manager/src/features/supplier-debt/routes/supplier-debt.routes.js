import React from "react";
import { HomeOutlined } from "@ant-design/icons";
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
  roles: ["admin"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách công nợ của Nhà cung cấp",
      icon: null,
      path: SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
      visible: false,
    },
  ],
};
const SUPPLIER_DEBT_DETAILS_SCREEN = {
  id: "supplier-debt-details",
  path: SupplierDebtPaths.SUPPLIER_DEBT_DETAILS,
  component: DetailsSupplierDebtScreen,
  isPrivateRoute: true,
  pageTitle: "Supplier Debt Details",
  roles: ["admin"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách công nợ của Nhà cung cấp",
      icon: null,
      path: SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
      visible: true,
    },
    {
      label: "Chi tiết công nợ của Nhà cung cấp",
      icon: null,
      path: SupplierDebtPaths.SUPPLIER_DEBT_DETAILS,
      visible: false,
    },
  ],
};

const SUPPLIER_DEBT_ROUTES = [
  SUPPLIER_DEBT_DETAILS_SCREEN,
  SUPPLIER_DEBT_SCREEN,
];

export default SUPPLIER_DEBT_ROUTES;
