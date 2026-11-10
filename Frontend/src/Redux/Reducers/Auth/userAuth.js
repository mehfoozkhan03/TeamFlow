
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  isLoading: false,
  isError: false,
  message: "",
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Keep your existing async thunk cases here,
    // if you have signupUser and loginUser.
  },
});

export const { logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
