import { api } from "api/api";
import { ProductEndPoints } from "../productManager";

const getProducts = () => {
  const url = ProductEndPoints.PRODUCT_MANAGER;
  return api.get(url);
};
const createProduct = (data) => {
  const url = ProductEndPoints.PRODUCT_MANAGER;
  return api.post(url, data);
};
const updateProduct = (id, data) => {
  const url = ProductEndPoints.PRODUCT_DETAILS.replace(":productId", id || "");

  return api.put(url, data);
};
const getDetailsProduct = (id) => {
  const url = ProductEndPoints.PRODUCT_DETAILS.replace(":productId", id || "");
  return api.get(url);
};
const searchProduct = (code) => {
  const url = ProductEndPoints.SEARCH_PRODUCT.replace(":productId", code || "");
  return api.get(url);
};
const searchProductBySupplier = (data) => {
  let url = ProductEndPoints.SEARCH_PRODUCT_BY_SUPPLIER.replace(
    ":productId",
    data.code || ""
  );
  url = url.replace(":supplierId", data.supplierId || "");
  return api.get(url);
};
const createDetailsProduct = (data) => {
  const url = ProductEndPoints.CREATE_DETAILS_PRODUCT;
  return api.post(url, data);
};

const productApi = {
  getProducts,
  createProduct,
  updateProduct,
  getDetailsProduct,
  searchProduct,
  createDetailsProduct,
  searchProductBySupplier,
};
export default productApi;
