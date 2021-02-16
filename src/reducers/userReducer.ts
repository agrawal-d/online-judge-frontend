import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { downloadUser } from "../lib";
import { AppThunk, RootState } from "../store";
import { User } from "../types";

export type UserState = User | null;
const initialState: UserState = null as UserState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const refreshUser = (): AppThunk => async (dispatch) => {
  const newUser = await downloadUser();

  if (newUser.errors) {
    console.error(newUser);
    throw new Error(newUser);
  }
  return dispatch(setUser(newUser));
};

export const updateHE = (data: {
  he_client_id: string;
  he_client_secret: string;
}): AppThunk => async (dispatch) => {
  await axios.post("users/me/update-he", data);
  return dispatch(refreshUser());
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
