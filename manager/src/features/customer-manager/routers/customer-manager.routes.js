import React from "react";

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
};
const CUSTOMER_DETAILS_SCREEN = {
  id: "customer_id",
  path: CustomerManagerPaths.CUSTOMER_DETAIL,
  component: CustomerDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Detail",
  roles: ["admin", "employee"],
  exact: true,
};

const CUSTOMER_MANAGER_ROUTES = [
  CUSTOMER_LIST_SCREEN, 
  CUSTOMER_DETAILS_SCREEN,
];

export default CUSTOMER_MANAGER_ROUTES;
