// state

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { userAuthServices as userAuth } from "../../Services/UserServices";

// ========= asyncThunk fucntion of 'user' ========= //

const fetchUser = createAsyncThunk("fetchUserAll", async (value) => {
  try {
    let data = await userAuth.signup(value);

    console.log("🚀 ~ data:", data);
    return data;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
});

// ========= state of redux 'user' ========= //

const initialState = {
  user: [],
  isAuth: false,
  isLoading: false,
  isError: false,
};

const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: (state, action) => {
    // sync code
    // 1. logout
  },
  extraReducers: (builder) => {
    // async behaviour code.
  },
});

export {
  // === thunk export === //
  fetchUser,

  // === state export === //
  UserReducer,
};
