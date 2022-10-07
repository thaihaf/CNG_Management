import { combineReducers } from "@reduxjs/toolkit";

import { authReducer, AUTHEN_FEATURE_KEY } from "features/auth/auth";
import { employeesReducer, EMPLOYEES_FEATURE_KEY } from "features/employee-manager/employeeManager";
import { permissionsReducer, PERMISSIONS_FEATURE_KEY } from "features/permissions/permission";

const rootReducer = combineReducers({
     [AUTHEN_FEATURE_KEY]: authReducer,
     [EMPLOYEES_FEATURE_KEY]: employeesReducer,
     [PERMISSIONS_FEATURE_KEY]: permissionsReducer,
});

export default rootReducer;
