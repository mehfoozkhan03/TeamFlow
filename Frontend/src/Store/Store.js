import {configureStore} from "@reduxjs/toolkit"

import {UserReducer} from "./User/User"

export const timeflow_Store = configureStore({
    reducer:{
        user:UserReducer
    }
});
