import { AuthLayout, DefaultLayout } from "components";
import { AuthPaths } from "features/auth/auth";
import { Helmet } from "react-helmet";
import { Redirect, Route } from "react-router-dom";

// import { Permission } from "@app/features/permissions/permissions";
// import RestrictAccess from "./components/RestrictAccess/RestrictAccess";

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
                         permissions, //
                    }) => {
                         const Layout = isPrivateRoute
                              ? DefaultLayout
                              : AuthLayout;

                         return (
                              <Route
                                   exact
                                   key={id}
                                   path={path}
                                   render={(routeProps) => {
                                        const Component = component;

                                        const renderContent = (
                                             <>
                                                  <Helmet>
                                                       <title>
                                                            {pageTitle}
                                                       </title>
                                                  </Helmet>
                                                  <Layout>
                                                       <Component
                                                            {...routeProps}
                                                       />
                                                  </Layout>
                                             </>
                                        );

                                        //  const isLogin = localStorage.getItem("isLogin");
                                        const isLogin = true;
                                        if (isPrivateRoute && !isLogin) {
                                             return (
                                                  <Redirect
                                                       key="AUTH_ROUTE"
                                                       to={AuthPaths.LOGIN}
                                                  />
                                             );
                                        }

                                        return (
                                             //  (permissions && (
                                             //       <Permission
                                             //            fallback={<RestrictAccess />}
                                             //            requiredPermissions={permissions}
                                             //       >
                                             //            {renderContent}
                                             //       </Permission>
                                             //  )) ||
                                             renderContent
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
