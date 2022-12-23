import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { CustomerManagerPaths } from "../constants/customer-manager.paths";

const CustomerListScreen = React.lazy(() =>
  import("../screens/CustomerList/CustomerList")
);
const CustomerDetailsScreen = React.lazy(() =>
  import("../screens/CustomerDetails/CustomerDetails")
);
const CUSTOMER_LIST_SCREEN = {
  id: "customer-list",
  path: CustomerManagerPaths.CUSTOMER_LIST,
  component: CustomerListScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Khách hàng",
      icon: null,
      path: CustomerManagerPaths.CUSTOMER_LIST,
      visible: false,
    },
  ],
};
const CUSTOMER_DETAILS_SCREEN = {
  id: "customer_id",
  path: CustomerManagerPaths.CUSTOMER_DETAIL,
  component: CustomerDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Detail",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Khách hàng",
      icon: null,
      path: CustomerManagerPaths.CUSTOMER_LIST,
      visible: true,
    },
    {
      label: "Chi tiết Khách hàng",
      icon: null,
      path: CustomerManagerPaths.CUSTOMER_DETAIL,
      visible: false,
    },
  ],
};

const CUSTOMER_MANAGER_ROUTES = [
  CUSTOMER_LIST_SCREEN, 
  CUSTOMER_DETAILS_SCREEN,
];

export default CUSTOMER_MANAGER_ROUTES;
