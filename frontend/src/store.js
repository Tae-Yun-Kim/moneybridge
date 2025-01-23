import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";
import walletReducer from "./slices/walletSlice";
// import cartSlice from "./slices/cartSlice";

export default configureStore({
  reducer: {
    loginSlice: loginSlice,
    wallet: walletReducer,
    // cartSlice: cartSlice,
  },
});
