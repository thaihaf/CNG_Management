import {
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import rootReducer from "./root-reducer";

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

// if (process.env.NODE_ENV === "development" && module.hot) {
//   module.hot.accept("./root-reducer", () => {
//     const newRootReducer = require("./root-reducer").default;
//     store.replaceReducer(newRootReducer);
//   });
// }

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const persistor = persistStore(store);

export default store;