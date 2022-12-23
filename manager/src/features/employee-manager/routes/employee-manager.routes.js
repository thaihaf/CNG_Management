import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { EmployeeManagerPaths } from "../constants/employee-manager.paths";

const EmployeeListScreen = React.lazy(() =>
     import("../screens/EmployeeList/EmployeeList")
);
const EmployeeDetailsScreen = React.lazy(() =>
     import("../screens/EmployeeDetails/EmployeeDetails")
);
const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
const AccountListScreen = React.lazy(() =>
     import("../screens/AccountList/AccountList")
);

const EMPLOYEE_LIST_SCREEN = {
  id: "employee-list",
  path: EmployeeManagerPaths.EMPLOYEE_MANAGER,
  component: EmployeeListScreen,
  isPrivateRoute: true,
  pageTitle: "Employe Manager",
  roles: ["admin"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Nhân viên",
      icon: null,
      path: EmployeeManagerPaths.EMPLOYEE_MANAGER,
      visible: false,
    },
  ],
};
const PROFILE_SCREEN = {
  id: "profile",
  path: EmployeeManagerPaths.EMPLOYEE_PROFILE,
  component: ProfileScreen,
  isPrivateRoute: true,
  pageTitle: "Profile",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Hồ sơ",
      icon: null,
      path: EmployeeManagerPaths.EMPLOYEE_PROFILE,
      visible: false,
    },
  ],
};
const ACCOUNT_LIST_SCREEN = {
  id: "account-list",
  path: EmployeeManagerPaths.ACCOUNT_LIST,
  component: AccountListScreen,
  isPrivateRoute: true,
  pageTitle: "Account List",
  roles: ["admin"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Tài khoản",
      icon: null,
      path: EmployeeManagerPaths.ACCOUNT_LIST,
      visible: false,
    },
  ],
};

const EMPLOYEE_DETAILS_SCREEN = {
  id: "employee_id",
  path: EmployeeManagerPaths.EMPLOYEE_DETAILS,
  component: EmployeeDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Employee Detail",
  roles: ["admin"],
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Nhân viên",
      icon: null,
      path: EmployeeManagerPaths.EMPLOYEE_MANAGER,
      visible: true,
    },
    {
      label: "Chi tiết Nhân viên",
      icon: null,
      path: EmployeeManagerPaths.EMPLOYEE_PROFILE,
      visible: false,
    },
  ],
};

const EMPLOYEE_MANAGER_ROUTES = [
     EMPLOYEE_LIST_SCREEN,
     EMPLOYEE_DETAILS_SCREEN,
     PROFILE_SCREEN,
     ACCOUNT_LIST_SCREEN,
];

export default EMPLOYEE_MANAGER_ROUTES;
