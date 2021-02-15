import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "./features/demo/counterSlice";
import userReducer from "./reducers/userReducer";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
