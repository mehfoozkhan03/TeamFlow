
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  userAuthServices as userAuth,
} from "../../Services/UserServices";

// ========== SIGNUP THUNK ========== //

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (value, { rejectWithValue }) => {
    try {
      const data = await userAuth.signup(value);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Signup failed"
      );
    }
  }
);

// ========== LOGIN THUNK ========== //

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (value, { rejectWithValue }) => {
    try {
      const data = await userAuth.login(value);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

// ========== INITIAL STATE ========== //

const initialState = {
  user: null,
  isAuth: false,
  isLoading: false,
  isError: false,
  message: "",
};

// ========== REDUX SLICE ========== //

const UserReducer = createSlice({
  name: "user",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP: PENDING
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // SIGNUP: SUCCESS
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.message = "Signup successful";
      })

      // SIGNUP: ERROR
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Signup failed";
      })

      // LOGIN: PENDING
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // LOGIN: SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isError = false;
        state.message = "Login successful";
      })

      // LOGIN: ERROR
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed";
      });
  },
});

export const { logout } = UserReducer.actions;

export default UserReducer.reducer;
