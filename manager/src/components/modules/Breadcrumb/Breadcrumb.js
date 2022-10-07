import React from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import "./Breadcrumb.css"
export default function BreadcrumbModule({ route, params, routes, paths }) {
     function itemRender(route, params, routes, paths) {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
               <span>{route.breadcrumbName}</span>
          ) : (
               <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
          );
     }

     return <Breadcrumb itemRender={itemRender} routes={routes} />;
}
