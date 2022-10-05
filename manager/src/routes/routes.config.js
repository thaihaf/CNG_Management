import { EMPLOYEE_MANAGER_ROUTES } from "features/employee-manager/employeeManager";
import { AUTH_ROUTES } from "features/auth/auth";
import { DASHBOARD_ROUTES } from "features/dashboard/dashboard";
// import { NOTICE_ROUTES } from "features/notice/notice";
// import { UPLOAD_ROUTES } from "features/uploadCSV/upload";

export const ROOT_ROUTE = "/";

export const ROUTE_LIST = [
     ...DASHBOARD_ROUTES,
     ...AUTH_ROUTES,
     ...EMPLOYEE_MANAGER_ROUTES,
];