import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";

import rootReducer from "./root-reducer";

const store = configureStore({
     reducer: rootReducer,
     devTools: process.env.NODE_ENV !== "production",
     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
               serializableCheck: false,
          }),
});

// if (process.env.NODE_ENV === "development" && module.hot) {
//   module.hot.accept("./root-reducer", () => {
//     const newRootReducer = require("./root-reducer").default;
//     store.replaceReducer(newRootReducer);
//   });
// }

export const persistor = persistStore(store);

export default store;
