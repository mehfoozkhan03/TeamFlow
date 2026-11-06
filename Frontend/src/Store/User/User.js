
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAuthServices as userAuth } from "../../Services/UserServices";
import { getToken } from "../../Services/authUtils";

// ================= INITIAL STATE ================= //

const initialState = {
  user: null,
  isAuth: Boolean(getToken()),
  isLoading: false,
  isError: false,
  message: "",
};

// ================= SIGNUP THUNK ================= //

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (value, { rejectWithValue }) => {
    try {
      const data = await userAuth.signup(value);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Signup failed"
      );
    }
  }
);

// ================= LOGIN THUNK ================= //

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (value, { rejectWithValue }) => {
    try {
      const data = await userAuth.login(value);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    }
  }
);

// ================= REDUX SLICE ================= //

const UserReducer = createSlice({
  name: "user",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    clearAuthMessage: (state) => {
      state.message = "";
      state.isError = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP PENDING
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // SIGNUP SUCCESS
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user ?? action.payload;
        state.isError = false;
        state.message = "Signup successful";
      })

      // SIGNUP ERROR
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Signup failed";
      })

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload?.user ?? action.payload;
        state.isAuth = true;
        state.isError = false;
        state.message = "Login successful";
      })

      // LOGIN ERROR
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed";
      });
  },
});

// ================= EXPORTS ================= //

export const { logout, clearAuthMessage } = UserReducer.actions;

export default UserReducer.reducer;
