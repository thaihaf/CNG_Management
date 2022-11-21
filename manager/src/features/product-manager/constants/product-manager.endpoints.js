export const ProductEndPoints = {
  PRODUCT_MANAGER: "/product",
  PRODUCT_DETAILS: "/product/:productId",
  PRODUCT_IMPORT_MANAGER: "/import-product",
  PRODUCT_IMPORT_DETAILS: "/import-product/:importId",
  SEARCH_PRODUCT: "/product/search-by-code/:productId",
  SEARCH_PRODUCT_BY_SUPPLIER:
    "/product/search-by-supplier/:productId/:supplierId",
  CREATE_DETAILS_PRODUCT: "/product-detail",
};
