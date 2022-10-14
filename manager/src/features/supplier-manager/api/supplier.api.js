import { api } from "api/api";
import { SupplierEndPoints } from "../supplierManager";

const getSuppliers = () => {
     const url = SupplierEndPoints.SUPPLIER_MANAGER;
     return api.get(url);
};
const createDetails = (data) => {
     const url = SupplierEndPoints.SUPPLIER_MANAGER;
     return api.post(url, data);
};
const createSupplier = (data) => {
     const url = SupplierEndPoints.CREATE_SUPPLIER;
     return api.post(url, data);
};
const getSupplierDetails = (id) => {
     const url = SupplierEndPoints.SUPPLIER_DETAIL.replace(
          ":supplierId",
          id || ""
     );
     return api.get(url);
};
const updateDetails = (id, data) => {
     const url = SupplierEndPoints.SUPPLIER_DETAIL.replace(
          ":supplierId",
          id || ""
     );
     return api.put(url, data);
};
const supplierApi = { 
     getSuppliers, 
     getSupplierDetails,
     createSupplier,
     createDetails,
     updateDetails };
export default supplierApi;
