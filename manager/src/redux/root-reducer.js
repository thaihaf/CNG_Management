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
     permissionsReducer,
     PERMISSIONS_FEATURE_KEY,
} from "features/permissions/permission";
import {
     PROVINCES_FEATURE_KEY,
     provincesReducer,
} from "features/provinces/provinces";

const rootReducer = combineReducers({
     [AUTHEN_FEATURE_KEY]: authReducer,
     [EMPLOYEES_FEATURE_KEY]: employeesReducer,
     [SUPPLIERS_FEATURE_KEY]: suppliersReducer,
     [BRANDS_FEATURE_KEY]: brandsReducer,
     [WAREHOUSE_FEATURE_KEY]: warehousesReducer,
     [PERMISSIONS_FEATURE_KEY]: permissionsReducer,
     [PROVINCES_FEATURE_KEY]: provincesReducer,
});

export default rootReducer;
