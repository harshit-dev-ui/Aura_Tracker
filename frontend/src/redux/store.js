import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/auth/userSlice";

// Combine your slices into a root reducer
const rootReducer = combineReducers({
  user: userSlice,
});

// Configure the Redux store with the root reducer and necessary middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const RootState = rootReducer;
export const AppDispatch = store.dispatch;
