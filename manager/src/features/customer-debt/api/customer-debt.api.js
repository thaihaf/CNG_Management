import { api } from "api/api";
import { CustomerDebtEndPoints } from "../customerDebt";

const getProducts = () => {
  const url = CustomerDebtEndPoints.PRODUCT_MANAGER;
  return api.get(url);
};
const createProduct = (data) => {
  const url = CustomerDebtEndPoints.PRODUCT_MANAGER;
  return api.post(url, data);
};
const updateProduct = (id, data) => {
  const url = CustomerDebtEndPoints.PRODUCT_DETAILS.replace(":productId", id || "");

  return api.put(url, data);
};
const getDetailsProduct = (id) => {
  const url = CustomerDebtEndPoints.PRODUCT_DETAILS.replace(":productId", id || "");
  return api.get(url);
};
const searchProduct = (code) => {
  const url = CustomerDebtEndPoints.SEARCH_PRODUCT.replace(":productId", code || "");
  return api.get(url);
};
const searchProductBySupplier = (data) => {
  let url = CustomerDebtEndPoints.SEARCH_PRODUCT_BY_SUPPLIER.replace(
    ":productId",
    data.code || ""
  );
  url = url.replace(":supplierId", data.supplierId || "");
  return api.get(url);
};
const createDetailsProduct = (data) => {
  const url = CustomerDebtEndPoints.DETAILS_PRODUCT;
  return api.post(url, data);
};
const updateDetailsProduct = (id, data) => {
  const url = CustomerDebtEndPoints.DETAILS_PRODUCT_MANAGER.replace(":id", id);
  return api.put(url, data);
};
const deleteDetailsProduct = (id) => {
  const url = CustomerDebtEndPoints.DETAILS_PRODUCT_MANAGER.replace(":id", id);
  return api.delete(url);
};

const productApi = {
  getProducts,
  createProduct,
  updateProduct,
  getDetailsProduct,
  searchProduct,
  createDetailsProduct,
  updateDetailsProduct,
  deleteDetailsProduct,
  searchProductBySupplier,
};
export default productApi;
