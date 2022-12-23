import React from "react";
import { CategoryManagerPaths } from "../constants/category-manager.paths";
import { HomeOutlined } from "@ant-design/icons";

const CategoryListScreen = React.lazy(() =>
  import("../screens/CategoryList/CategoryList")
);

const CATEGORY_LIST_SCREEN = {
  id: "category-list",
  path: CategoryManagerPaths.CATEGORY_LIST,
  component: CategoryListScreen,
  isPrivateRoute: true,
  pageTitle: "Category Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Chức năng",
      icon: null,
      path: CategoryManagerPaths.CATEGORY_LIST,
      visible: false,
    },
  ],
};

const CATEGORY_MANAGER_ROUTES = [CATEGORY_LIST_SCREEN];

export default CATEGORY_MANAGER_ROUTES;
