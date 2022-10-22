import React from "react";

import { CategoryManagerPaths } from "../constants/category-manager.paths";

const CategoryListScreen = React.lazy(() =>
  import("../screens/CategoryList/CategoryList")
);
// const CreateSupplier = React.lazy(() =>
//   import("../screens/CreateSupplier/CreateSupplier")
// );
const CategoryDetailsScreen = React.lazy(() =>
  import("../screens/CategoryDetails/CategoryDetails")
);
// const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
const CATEGORY_LIST_SCREEN = {
  id: "category-list",
  path: CategoryManagerPaths.CATEGORY_LIST,
  component: CategoryListScreen,
  isPrivateRoute: true,
  pageTitle: "Category Manager",
};
// const SUPPLIER_CREATE_SCREEN = {
//   id: "supplier-create",
//   path: SupplierManagerPaths.CREATE_SUPPLIER,
//   component: CreateSupplier,
//   isPrivateRoute: true,
//   pageTitle: "Supplier Create",
// };
const CATEGORY_DETAILS_SCREEN = {
  id: "category_id",
  path: CategoryManagerPaths.CATEGORY_DETAIL,
  component: CategoryDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Category Detail",
};

const CATEGORY_MANAGER_ROUTES = [
  CATEGORY_LIST_SCREEN, 
  // SUPPLIER_CREATE_SCREEN,
  CATEGORY_DETAILS_SCREEN,
];

export default CATEGORY_MANAGER_ROUTES;
