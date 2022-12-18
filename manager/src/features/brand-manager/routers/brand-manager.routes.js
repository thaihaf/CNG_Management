import React from "react";
import { BrandManagerPaths } from "../constants/brand-manager.paths";

const BrandListScreen = React.lazy(() =>
  import("../screens/BrandList/BrandList")
);
const BrandDetailsScreen = React.lazy(() =>
  import("../screens/BrandDetails/BrandDetails")
);
const BRAND_LIST_SCREEN = {
  id: "brand-list",
  path: BrandManagerPaths.BRAND_LIST,
  component: BrandListScreen,
  isPrivateRoute: true,
  pageTitle: "Brand Manager",
  roles: ["admin", "employee"],
  exact: true,
};
const BRAND_DETAILS_SCREEN = {
  id: "brand_id",
  path: BrandManagerPaths.BRAND_DETAIL,
  component: BrandDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Brand Detail",
  roles: ["admin", "employee"],
  exact: true,
};

const BRAND_MANAGER_ROUTES = [BRAND_LIST_SCREEN, BRAND_DETAILS_SCREEN];

export default BRAND_MANAGER_ROUTES;
