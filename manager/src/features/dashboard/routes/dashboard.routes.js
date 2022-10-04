import React from "react";

import { DashboardPaths } from "../constants/dashboard.paths";

const Dashboard = React.lazy(() => import("../screens/Dashboard/Dashboard"));

const DASHBOARD_SCREEN = {
     id: "dashboard",
     path: DashboardPaths.DASHBOARD,
     component: Dashboard,
     isPrivateRoute: false,
     pageTitle: "Dashboard",
};

const DASHBOARD_ROUTES = [DASHBOARD_SCREEN];

export default DASHBOARD_ROUTES;
