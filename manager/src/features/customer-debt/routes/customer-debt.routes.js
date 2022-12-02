import React from "react";

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
};
const CUSTOMER_DEBT_DETAILS_SCREEN = {
  id: "customer-debt-details",
  path: CustomerDebtPaths.CUSTOMER_DEBT_DETAILS,
  component: DetailsCustomerDebtScreen,
  isPrivateRoute: true,
  pageTitle: "Customer Debt Details",
};

const CUSTOMER_DEBT_ROUTES = [
  CUSTOMER_DEBT_DETAILS_SCREEN,
  CUSTOMER_DEBT_SCREEN,
];

export default CUSTOMER_DEBT_ROUTES;
