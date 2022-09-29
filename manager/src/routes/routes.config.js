import { EMPLOYEE_MANAGER_ROUTES } from "features/employee-manager/employeeManager";
import { AUTH_ROUTES } from "features/auth/auth";
// import { NOTICE_ROUTES } from "features/notice/notice";
// import { UPLOAD_ROUTES } from "features/uploadCSV/upload";

export const ROOT_ROUTE = "/";

export const ROUTE_LIST = [
  ...EMPLOYEE_MANAGER_ROUTES,
	...AUTH_ROUTES,
];