import { EMPLOYEE_MANAGER_ROUTES } from "features/employee-manager/employeeManager";
import { SUPPLIER_MANAGER_ROUTES } from "features/supplier-manager/supplierManager";
import { BRAND_MANAGER_ROUTES } from "features/brand-manager/brandManager";
import { WAREHOUSE_MANAGER_ROUTES } from "features/warehouse-manager/warehouseManager";
import { AUTH_ROUTES } from "features/auth/auth";
import { DASHBOARD_ROUTES } from "features/dashboard/dashboard";
// import { NOTICE_ROUTES } from "features/notice/notice";
// import { UPLOAD_ROUTES } from "features/uploadCSV/upload";

export const ROOT_ROUTE = "/admin/";

export const ROUTE_LIST = [
     ...DASHBOARD_ROUTES,
     ...AUTH_ROUTES,
     ...EMPLOYEE_MANAGER_ROUTES,
     ...SUPPLIER_MANAGER_ROUTES,
     ...BRAND_MANAGER_ROUTES,
     ...WAREHOUSE_MANAGER_ROUTES,
];
