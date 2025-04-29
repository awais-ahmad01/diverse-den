import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth"; 
import notificationsReducer from "./reducers/notifications";
import branchesReducer from "./reducers/branches";
import salespersonReducer from "./reducers/salespersons";
import productsReducer from "./reducers/products"
import ordersReducer from "./reducers/orders";
import usersReducer from "./reducers/users";
import businessesReducer from "./reducers/businesses";
import subscriptionPlansReducer from "./reducers/subscriptionPlans";
import saleEventsReducer from "./reducers/saleEvents";
import cartReducer from "./reducers/cart";
import analyticsReducer from "./reducers/analytics";

const store = configureStore({
    reducer: {
        auth: authReducer,  // Use `authReducer` here, not `authSlice`
        notifications: notificationsReducer,
        branches: branchesReducer,
        salespersons: salespersonReducer,
        products: productsReducer,
        orders: ordersReducer,
        users: usersReducer,
        businesses: businessesReducer,
        subscriptionPlans: subscriptionPlansReducer,
        saleEvents: saleEventsReducer,
        cart: cartReducer,
        analytics: analyticsReducer

    },
});

export default store;
