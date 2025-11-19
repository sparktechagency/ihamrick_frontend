// store.js
import { configureStore } from '@reduxjs/toolkit';
import allApi from '../services/allApi';
const store = configureStore({
  reducer: {
    [allApi.reducerPath]: allApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(allApi.middleware),
});

export default store;
