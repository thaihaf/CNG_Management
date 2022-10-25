import React from "react";

import { ProductManagerPaths } from "../constants/product-manager.paths";

const ProductListScreen = React.lazy(() =>
     import("../screens/ProductList/ProductList")
);
const CreateProductScreen = React.lazy(() =>
     import("../screens/CreateProduct/CreateProduct")
);

const PRODUCT_LIST_SCREEN = {
     id: "product-list",
     path: ProductManagerPaths.PRODUCT_MANAGER,
     component: ProductListScreen,
     isPrivateRoute: true,
     pageTitle: "Product Manager",
};
const CREATE_PRODUCT_SCREEN = {
     id: "create-product",
     path: ProductManagerPaths.CREATE_PRODUCT,
     component: CreateProductScreen,
     isPrivateRoute: true,
     pageTitle: "Create Product",
};

const PRODUCT_MANAGER_ROUTES = [PRODUCT_LIST_SCREEN, CREATE_PRODUCT_SCREEN];

export default PRODUCT_MANAGER_ROUTES;
