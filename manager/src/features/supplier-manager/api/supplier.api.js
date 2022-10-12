import { api } from "api/api";
import { SupplierManagerPaths } from "../supplierManager";

const getSuppliers = () => {
     const url = SupplierManagerPaths.SUPPLIER_LIST;
     return api.get(url);
};
const getSupplierDetails = (id) => {
     const url = SupplierManagerPaths.SUPPLIER_DETAIL.replace(
          ":supplierId",
          id || ""
     );
     return api.get(url);
};
const supplierApi = { getSuppliers, getSupplierDetails };
export default supplierApi;
