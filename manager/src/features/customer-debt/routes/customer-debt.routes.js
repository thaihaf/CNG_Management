import React from "react";

import { HomeOutlined } from "@ant-design/icons";
import { CustomerDebtPaths } from "../constants/customer-debt.paths";

const CustomerDebtListScreen = React.lazy(() =>
  import("../screens/CustomerDebtList/CustomerDebtList")
);
const DetailsCustomerDebtScreen = React.lazy(() =>
  import("../screens/DetailsCustomerDebt/DetailsCustomerDebt")
);

const CUSTOMER_DEBT_SCREEN = {
  id: "customer-debt-list",
  path: CustomerDebtPaths.CUSTOMER_DEBT_MANAGER,
  component: CustomerDebtListScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Debt Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách công nợ Khách hàng",
      icon: null,
      path: CustomerDebtPaths.CUSTOMER_DEBT_MANAGER,
      visible: false,
    },
  ],
};
const CUSTOMER_DEBT_DETAILS_SCREEN = {
  id: "customer-debt-details",
  path: CustomerDebtPaths.CUSTOMER_DEBT_DETAILS,
  component: DetailsCustomerDebtScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Debt Details",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách công nợ Khách hàng",
      icon: null,
      path: CustomerDebtPaths.CUSTOMER_DEBT_MANAGER,
      visible: true,
    },
    {
      label: "Chi tiết công nợ Khách hàng",
      icon: null,
      path: CustomerDebtPaths.CUSTOMER_DEBT_DETAILS,
      visible: false,
    },
  ],
};

const CUSTOMER_DEBT_ROUTES = [
  CUSTOMER_DEBT_DETAILS_SCREEN,
  CUSTOMER_DEBT_SCREEN,
];

export default CUSTOMER_DEBT_ROUTES;
