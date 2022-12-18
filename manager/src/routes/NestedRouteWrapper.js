import React from "react";
import { AuthLayout, DefaultLayout } from "components";
import { Helmet } from "react-helmet";
import { Redirect, Route } from "react-router-dom";
import { checkPermission } from "helpers/auth.helpers";
import RestrictAccess from "components/modules/RestrictAccess/RestrictAccess";

const NestedRouteWrapper = ({ routesWithComponents }) => {
  return (
    <>
      {routesWithComponents.map(
        ({
          id,
          path,
          component,
          pageTitle,
          isPrivateRoute,
          isAuthRoute,
          roles,
          exact,
        }) => {
          const Layout = isPrivateRoute ? DefaultLayout : AuthLayout;

          return (
            <Route
              exact={exact}
              key={id}
              path={path}
              render={(routeProps) => {
                // const isLogin = getIsLogin();
                // if (isPrivateRoute && !isLogin) {
                //   console.log("first")
                // }
                //  if (isRoot && isLogin) {
                //    console.log("path", path2);
                //    return <Redirect key={id} to={path2} />;
                //  }
                const Component = component;
                if (isAuthRoute) {
                  return (
                    <>
                      <Helmet>
                        <title>{pageTitle}</title>
                      </Helmet>
                      <Layout>
                        <Component {...routeProps} />
                      </Layout>
                    </>
                  );
                }

                return (
                  <>
                    <Helmet>
                      <title>{pageTitle}</title>
                    </Helmet>
                    <Layout>
                      {checkPermission(roles) ? (
                        <Component {...routeProps} />
                      ) : (
                        <RestrictAccess {...routeProps} />
                      )}
                    </Layout>
                  </>
                );
              }}
            />
          );
        }
      )}
    </>
  );
};

export default NestedRouteWrapper;
