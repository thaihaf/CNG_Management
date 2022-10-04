import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "features/auth/auth";
import {
  permissionsReducer,
  PERMISSIONS_FEATURE_KEY,
} from "features/permissions/permission";

const rootReducer = combineReducers({
  [PERMISSIONS_FEATURE_KEY]: permissionsReducer,
  auth: authReducer,
});

export default rootReducer;