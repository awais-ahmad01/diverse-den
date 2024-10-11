import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";  // Use the default export (authSlice.reducer)

const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
    },
});

export default store;
