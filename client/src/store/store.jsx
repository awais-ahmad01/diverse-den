import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth"; 
import notificationsReducer from "./reducers/notifications";
import branchesReducer from "./reducers/branches";
import salespersonReducer from "./reducers/salespersons";
import productsReducer from "./reducers/products"
import ordersReducer from "./reducers/orders";


const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
        notifications: notificationsReducer,
        branches: branchesReducer,
        salespersons: salespersonReducer,
        products: productsReducer,
        orders: ordersReducer
    },
});

export default store;
