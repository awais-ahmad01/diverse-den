import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth"; 
import notificationsReducer from "./reducers/notifications";
import branchesReducer from "./reducers/branches";


const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
        notifications: notificationsReducer,
        branches: branchesReducer
    },
});

export default store;
