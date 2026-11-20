
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./User/User";
import MemberReducer from "./Member/Member";

// Configure the Redux store with user and member reducers.
export const timeflow_Store = configureStore({
  reducer: {
    user: UserReducer,
    member: MemberReducer,
  },
});
