import { api } from "api/api";
import { CategoryEndPoints } from "../categoryManager";

const getCategories = (params) => {
  const url = CategoryEndPoints.CATEGORY_MANAGER;
  return api.get(url, { params });
};
const getActiveCategories = () => {
  const url = CategoryEndPoints.CATEGORY_ACTIVE;
  return api.get(url);
};
const createDetails = (data) => {
  const url = CategoryEndPoints.CATEGORY_MANAGER;
  return api.post(url, data);
};
const getCategoryDetails = (id) => {
  const url = CategoryEndPoints.CATEGORY_DETAIL.replace(
    ":categoryId",
    id || ""
  );
  return api.get(url);
};
const updateDetails = (id, data) => {
  const url = CategoryEndPoints.CATEGORY_DETAIL.replace(
    ":categoryId",
    id || ""
  );
  return api.put(url, data);
};
const deleteCategory = (id) => {
  const url = CategoryEndPoints.CATEGORY_DETAIL.replace(
    ":categoryId",
    id || ""
  );
  return api.delete(url);
};
const categoryApi = {
  getCategories,
  getActiveCategories,
  getCategoryDetails,
  createDetails,
  updateDetails,
  deleteCategory,
};
export default categoryApi;
