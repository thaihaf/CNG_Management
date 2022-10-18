import React from "react";

import { BrandManagerPaths } from "../constants/brand-manager.paths";

const BrandListScreen = React.lazy(() =>
  import("../screens/BrandList/BrandList")
);
// const CreateSupplier = React.lazy(() =>
//   import("../screens/CreateSupplier/CreateSupplier")
// );
const BrandDetailsScreen = React.lazy(() =>
  import("../screens/BrandDetails/BrandDetails")
);
// const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
const BRAND_LIST_SCREEN = {
  id: "brand-list",
  path: BrandManagerPaths.BRAND_LIST,
  component: BrandListScreen,
  isPrivateRoute: true,
  pageTitle: "Brand Manager",
};
// const SUPPLIER_CREATE_SCREEN = {
//   id: "supplier-create",
//   path: SupplierManagerPaths.CREATE_SUPPLIER,
//   component: CreateSupplier,
//   isPrivateRoute: true,
//   pageTitle: "Supplier Create",
// };
const BRAND_DETAILS_SCREEN = {
  id: "brand_id",
  path: BrandManagerPaths.BRAND_DETAIL,
  component: BrandDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Brand Detail",
};

const BRAND_MANAGER_ROUTES = [
  BRAND_LIST_SCREEN, 
  // SUPPLIER_CREATE_SCREEN,
  BRAND_DETAILS_SCREEN,
];

export default BRAND_MANAGER_ROUTES;
