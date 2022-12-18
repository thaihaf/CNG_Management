import React from "react";
import { memo } from "react";

import Helmet from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";

import { AuthPaths } from "features/auth/auth";
import { ROUTE_LIST } from "./routes.config";

import { DefaultLayout } from "components";
import NotFound from "../components/modules/NotFound/NotFound";
import NestedRouteWrapper from "./NestedRouteWrapper";

const Routes = () => {
  return (
    <Switch>
      <NestedRouteWrapper routesWithComponents={ROUTE_LIST} />

      <Route exact path="/404" component={NotFound} />
      <Redirect to="/404" />
    </Switch>
  );
};

export default memo(Routes);
