import { EMPLOYEE_MANAGER_ROUTES } from "features/employee-manager/employeeManager";
import { SUPPLIER_MANAGER_ROUTES } from "features/supplier-manager/supplierManager";
import { BRAND_MANAGER_ROUTES } from "features/brand-manager/brandManager";
import { WAREHOUSE_MANAGER_ROUTES } from "features/warehouse-manager/warehouseManager";
import { CATEGORY_MANAGER_ROUTES } from "features/category-manager/categoryManager";
import { CUSTOMER_MANAGER_ROUTES } from "features/customer-manager/customerManager";
import { AUTH_ROUTES } from "features/auth/auth";
import { DASHBOARD_ROUTES } from "features/dashboard/dashboard";
import { PRODUCT_MANAGER_ROUTES } from "features/product-manager/productManager";
import { IMPORT_PRODUCT_ROUTES } from "features/import-product/importProduct";
import { EXPORT_PRODUCT_ROUTES } from "features/export-product/exportProduct";
import { CUSTOMER_DEBT_ROUTES } from "features/customer-debt/customerDebt";
import { SUPPLIER_DEBT_ROUTES } from "features/supplier-debt/supplierDebt";

export const ROOT_ROUTE = "/admin/";

export const ROUTE_LIST = [
  ...AUTH_ROUTES,
  ...DASHBOARD_ROUTES,
  ...EMPLOYEE_MANAGER_ROUTES,
  ...SUPPLIER_MANAGER_ROUTES,
  ...BRAND_MANAGER_ROUTES,
  ...WAREHOUSE_MANAGER_ROUTES,
  ...CATEGORY_MANAGER_ROUTES,
  ...CUSTOMER_MANAGER_ROUTES,
  ...PRODUCT_MANAGER_ROUTES,
  ...IMPORT_PRODUCT_ROUTES,
  ...EXPORT_PRODUCT_ROUTES,
  ...CUSTOMER_DEBT_ROUTES,
  ...SUPPLIER_DEBT_ROUTES,
];
