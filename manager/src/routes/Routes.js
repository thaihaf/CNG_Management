import React from "react";

import Helmet from "react-helmet";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import { AuthPaths } from "features/auth/auth";
import { ROUTE_LIST } from "./routes.config";

import { DefaultLayout } from "components";
import NotFound from "../components/modules/NotFound/NotFound";
import NestedRouteWrapper from "./NestedRouteWrapper";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const Routes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Switch location={location} key={location.pathname}>
        <NestedRouteWrapper routesWithComponents={ROUTE_LIST} />

        <Route component={NotFound} />
        {/* <Redirect to="/404" /> */}
      </Switch>
    </AnimatePresence>
  );
};

export default Routes;
