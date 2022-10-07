import React from "react";
import { memo } from "react";

import Helmet from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";

import { AuthPaths } from "features/auth/auth";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";
import { ROUTE_LIST } from "./routes.config";

import { DefaultLayout } from "components";
import NotFound from "./components/NotFound/NotFound";
import NestedRouteWrapper from "./NestedRouteWrapper";
import { DashboardPaths } from "features/dashboard/dashboard";

const Routes = () => {
     return (
          <Switch>
               <Redirect exact from="/" to={EmployeeManagerPaths.EMPLOYEE_LIST} />

               <NestedRouteWrapper routesWithComponents={ROUTE_LIST} />

               <Route
                    path="*"
                    render={() => (
                         <>
                              <Helmet>
                                   <title>Page Not Found</title>
                              </Helmet>
                              <DefaultLayout>
                                   <NotFound />
                              </DefaultLayout>
                         </>
                    )}
               />
          </Switch>
     );
};

export default memo(Routes);
