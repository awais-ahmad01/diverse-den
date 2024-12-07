import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth"; 
import notificationsReducer from "./reducers/notifications";
import branchesReducer from "./reducers/branches";
import salespersonReducer from "./reducers/salespersons";
import productsReducer from "./reducers/products"


const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
        notifications: notificationsReducer,
        branches: branchesReducer,
        salespersons: salespersonReducer,
        products: productsReducer
    },
});

export default store;
