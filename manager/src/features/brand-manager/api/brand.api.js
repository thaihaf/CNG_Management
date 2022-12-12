import { api } from "api/api";
import { BrandEndPoints } from "../brandManager";

const getBrands = (params) => {
  const url = BrandEndPoints.BRAND_MANAGER;
  return api.get(url, { params });
};
const createDetails = (data) => {
  const url = BrandEndPoints.BRAND_MANAGER;
  return api.post(url, data);
};
const getBrandDetails = (id) => {
  const url = BrandEndPoints.BRAND_DETAIL.replace(":brandId", id || "");
  return api.get(url);
};
const updateDetails = (id, data) => {
  const url = BrandEndPoints.BRAND_DETAIL.replace(":brandId", id || "");
  return api.put(url, data);
};
const deleteBrand = (id) => {
  const url = BrandEndPoints.BRAND_DETAIL.replace(":brandId", id || "");
  return api.delete(url);
};
const brandApi = {
  getBrands,
  getBrandDetails,
  createDetails,
  updateDetails,
  deleteBrand,
};
export default brandApi;
