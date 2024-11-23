import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";  // Use the default export (authSlice.reducer)
import notificationsReducer from "./reducers/notifications";


const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
        notifications: notificationsReducer,
    },
});

export default store;
