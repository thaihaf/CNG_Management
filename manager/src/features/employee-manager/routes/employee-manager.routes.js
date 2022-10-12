import React from "react";

import { EmployeeManagerPaths } from "../constants/employee-manager.paths";

const EmployeeListScreen = React.lazy(() =>
     import("../screens/EmployeeList/EmployeeList")
);
const EmployeeDetailsScreen = React.lazy(() =>
     import("../screens/EmployeeDetails/EmployeeDetails")
);
const ProfileScreen = React.lazy(() => import("../screens/Profile/Profile"));
// const EditScreen = React.lazy(() =>
//      import("../screens/EditClientMaster/EditScreen")
// );
// const ConfirmScreen = React.lazy(() =>
//      import("../screens/ConfirmInfo/ConfirmScreen")
// );

const EMPLOYEE_LIST_SCREEN = {
     id: "employee-list",
     path: EmployeeManagerPaths.EMPLOYEE_MANAGER,
     component: EmployeeListScreen,
     isPrivateRoute: true,
     pageTitle: "Employe Manager",
};
const PROFILE_SCREEN = {
     id: "profile",
     path: EmployeeManagerPaths.EMPLOYEE_PROFILE,
     component: ProfileScreen,
     isPrivateRoute: true,
     pageTitle: "Profile",
};
// const CONFIRM_SCREEN = {
//      id: "confirm",
//      path: EmployeeManagerPaths.CONFIRM,
//      component: ConfirmScreen,
//      isPrivateRoute: true,
//      pageTitle: "Confirm",
// };
// const EDIT_SCREEN = {
//      id: "edit",
//      path: EmployeeManagerPaths.EDIT_EMPLOYEE,
//      component: EditScreen,
//      isPrivateRoute: true,
//      pageTitle: "Update Employee",
// };
const EMPLOYEE_DETAILS_SCREEN = {
     id: "employee_id",
     path: EmployeeManagerPaths.EMPLOYEE_DETAILS,
     component: EmployeeDetailsScreen,
     isPrivateRoute: true,
     pageTitle: "Employee Detail",
};

const EMPLOYEE_MANAGER_ROUTES = [
     EMPLOYEE_LIST_SCREEN,
     EMPLOYEE_DETAILS_SCREEN,
     PROFILE_SCREEN,
     //  EDIT_SCREEN,
     //  CONFIRM_SCREEN,
];

export default EMPLOYEE_MANAGER_ROUTES;
