import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { WarehouseManagerPaths } from "../constants/warehouse-manager.paths";

const WarehouseListScreen = React.lazy(() =>
  import("../screens/WarehouseList/WarehouseList")
);

const WAREHOUSE_LIST_SCREEN = {
  id: "warehouse-list",
  path: WarehouseManagerPaths.WAREHOUSE_LIST,
  component: WarehouseListScreen,
  isPrivateRoute: true,
  pageTitle: "Warehouse Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Kho hàng",
      icon: null,
      path: WarehouseManagerPaths.WAREHOUSE_LIST,
      visible: false,
    },
  ],
};

const WAREHOUSE_MANAGER_ROUTES = [WAREHOUSE_LIST_SCREEN];

export default WAREHOUSE_MANAGER_ROUTES;
