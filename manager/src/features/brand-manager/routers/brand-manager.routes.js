import React from "react";
import { BrandManagerPaths } from "../constants/brand-manager.paths";
import { HomeOutlined } from "@ant-design/icons";

const BrandListScreen = React.lazy(() =>
  import("../screens/BrandList/BrandList")
);

const BRAND_LIST_SCREEN = {
  id: "brand-list",
  path: BrandManagerPaths.BRAND_LIST,
  component: BrandListScreen,
  isPrivateRoute: true,
  pageTitle: "Brand Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", disable: false },
    {
      label: "Danh sách Nhãn hàng",
      icon: null,
      path: BrandManagerPaths.BRAND_LIST,
      disable: true,
    },
  ],
};

const BRAND_MANAGER_ROUTES = [BRAND_LIST_SCREEN];

export default BRAND_MANAGER_ROUTES;
