import React from "react";
import { CategoryManagerPaths } from "../constants/category-manager.paths";

const CategoryListScreen = React.lazy(() =>
  import("../screens/CategoryList/CategoryList")
);
const CategoryDetailsScreen = React.lazy(() =>
  import("../screens/CategoryDetails/CategoryDetails")
);
const CATEGORY_LIST_SCREEN = {
  id: "category-list",
  path: CategoryManagerPaths.CATEGORY_LIST,
  component: CategoryListScreen,
  isPrivateRoute: true,
  pageTitle: "Category Manager",
  roles: ["admin", "employee"],
  exact: true,
};
const CATEGORY_DETAILS_SCREEN = {
  id: "category_id",
  path: CategoryManagerPaths.CATEGORY_DETAIL,
  component: CategoryDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Category Detail",
  roles: ["admin", "employee"],
  exact: true,
};

const CATEGORY_MANAGER_ROUTES = [CATEGORY_LIST_SCREEN, CATEGORY_DETAILS_SCREEN];

export default CATEGORY_MANAGER_ROUTES;
