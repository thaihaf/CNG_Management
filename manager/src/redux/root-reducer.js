import { combineReducers } from "@reduxjs/toolkit";

import { authReducer, AUTHEN_FEATURE_KEY } from "features/auth/auth";
import {
  employeesReducer,
  EMPLOYEES_FEATURE_KEY,
} from "features/employee-manager/employeeManager";
import {
  suppliersReducer,
  SUPPLIERS_FEATURE_KEY,
} from "features/supplier-manager/supplierManager";
import {
  brandsReducer,
  BRANDS_FEATURE_KEY,
} from "features/brand-manager/brandManager";
import {
  warehousesReducer,
  WAREHOUSE_FEATURE_KEY,
} from "features/warehouse-manager/warehouseManager";
import {
  categoriesReducer,
  CATEGORIES_FEATURE_KEY,
} from "features/category-manager/categoryManager";
import {
  customersReducer,
  CUSTOMERS_FEATURE_KEY,
} from "features/customer-manager/customerManager";
import {
  permissionsReducer,
  PERMISSIONS_FEATURE_KEY,
} from "features/permissions/permission";
import {
  PROVINCES_FEATURE_KEY,
  provincesReducer,
} from "features/provinces/provinces";
import {
  PRODUCT_FEATURE_KEY,
  productReducer,
} from "features/product-manager/productManager";
import {
  IMPORT_PRODUCT_FEATURE_KEY,
  importProductReducer,
} from "features/import-product/importProduct";
import {
  EXPORT_PRODUCT_FEATURE_KEY,
  exportProductReducer,
} from "features/export-product/exportProduct";
import {
  customerDebtReducer,
  CUSTOMER_DEBT_FEATURE_KEY,
} from "features/customer-debt/customerDebt";
// import {
//   supplierDebtReducer,
//   SUPPLIER_DEBT_FEATURE_KEY,
// } from "features/supplier-debt/supplierDebt";

const rootReducer = combineReducers({
  [AUTHEN_FEATURE_KEY]: authReducer,
  [EMPLOYEES_FEATURE_KEY]: employeesReducer,
  [SUPPLIERS_FEATURE_KEY]: suppliersReducer,
  [BRANDS_FEATURE_KEY]: brandsReducer,
  [WAREHOUSE_FEATURE_KEY]: warehousesReducer,
  [CATEGORIES_FEATURE_KEY]: categoriesReducer,
  [CUSTOMERS_FEATURE_KEY]: customersReducer,
  [PERMISSIONS_FEATURE_KEY]: permissionsReducer,
  [PROVINCES_FEATURE_KEY]: provincesReducer,
  [PRODUCT_FEATURE_KEY]: productReducer,
  [IMPORT_PRODUCT_FEATURE_KEY]: importProductReducer,
  [EXPORT_PRODUCT_FEATURE_KEY]: exportProductReducer,
  [CUSTOMER_DEBT_FEATURE_KEY]: customerDebtReducer,
  // [SUPPLIER_DEBT_FEATURE_KEY]: supplierDebtReducer,
});

export default rootReducer;
