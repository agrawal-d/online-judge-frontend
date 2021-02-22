import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { GlobalError } from "../types";

export type ErrorState = GlobalError[] | [];
const initialState: ErrorState = [] as ErrorState;

export const globlErrorsSlice = createSlice({
  name: "globalErrors",
  initialState,
  reducers: {
    setGlobalErrors: (state, action: PayloadAction<ErrorState>) => {
      return action.payload;
    },
  },
});

export const { setGlobalErrors } = globlErrorsSlice.actions;

export const selectGlobalErrors = (state: RootState) => state.globalErrors;

export default globlErrorsSlice.reducer;
