import { configureStore } from "@reduxjs/toolkit";
import usernameReducer from "./usernameSlice.js";

export const store = configureStore({
    reducer: { username: usernameReducer },
});
