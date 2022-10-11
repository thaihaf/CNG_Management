import { api } from "api/api";
import { SupplierManagerPaths } from "../supplierManager";

const getSupplier = () => {
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
const supplierApi = { getSupplier, getSupplierDetails };
export default supplierApi;
