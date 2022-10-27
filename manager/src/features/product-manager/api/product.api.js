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
     const url = ProductEndPoints.PRODUCT_DETAILS.replace(
          ":productId",
          id || ""
     );

     return api.put(url, data);
};
const getDetailsProduct = (id) => {
     const url = ProductEndPoints.PRODUCT_DETAILS.replace(
          ":productId",
          id || ""
     );
     return api.get(url);
};

const productApi = {
     getProducts,
     createProduct,
     updateProduct,
     getDetailsProduct,
};
export default productApi;
