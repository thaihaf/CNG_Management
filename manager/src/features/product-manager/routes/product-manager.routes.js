import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { ProductManagerPaths } from "../constants/product-manager.paths";

const ProductListScreen = React.lazy(() =>
  import("../screens/ProductList/ProductList")
);
const CreateProductScreen = React.lazy(() =>
  import("../screens/CreateProduct/CreateProduct")
);
const ProductDetailsScreen = React.lazy(() =>
  import("../screens/ProductDetails/ProductDetails")
);

const HOME = {
  id: "home",
  path: "/",
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Product Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Sản phẩm",
      icon: null,
      path: ProductManagerPaths.PRODUCT_MANAGER,
      visible: false,
    },
  ],
};
const PRODUCT_LIST_SCREEN = {
  id: "product-list",
  path: ProductManagerPaths.PRODUCT_MANAGER,
  component: ProductListScreen,
  isPrivateRoute: true,
  pageTitle: "Product Manager",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Sản phẩm",
      icon: null,
      path: ProductManagerPaths.PRODUCT_MANAGER,
      visible: false,
    },
  ],
};
const CREATE_PRODUCT_SCREEN = {
  id: "create-product",
  path: ProductManagerPaths.CREATE_PRODUCT,
  component: CreateProductScreen,
  isPrivateRoute: true,
  pageTitle: "Create Product",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Sản phẩm",
      icon: null,
      path: ProductManagerPaths.PRODUCT_MANAGER,
      visible: true,
    },
    {
      label: "Tạo mới Sản phẩm",
      icon: null,
      path: ProductManagerPaths.CREATE_PRODUCT,
      visible: false,
    },
  ],
};
const PRODUCT_DETAILS_SCREEN = {
  id: "product-details",
  path: ProductManagerPaths.PRODUCT_DETAILS,
  component: ProductDetailsScreen,
  isPrivateRoute: true,
  pageTitle: "Product Details",
  roles: ["admin", "employee"],
  exact: true,
  routes: [
    { label: "Trang chủ", icon: <HomeOutlined />, path: "/", visible: true },
    {
      label: "Danh sách Sản phẩm",
      icon: null,
      path: ProductManagerPaths.PRODUCT_MANAGER,
      visible: true,
    },
    {
      label: "Chi tiết Sản phẩm",
      icon: null,
      path: ProductManagerPaths.PRODUCT_DETAILS,
      visible: false,
    },
  ],
};

const PRODUCT_MANAGER_ROUTES = [
  HOME,
  CREATE_PRODUCT_SCREEN,
  PRODUCT_DETAILS_SCREEN,
  PRODUCT_LIST_SCREEN,
];

export default PRODUCT_MANAGER_ROUTES;
