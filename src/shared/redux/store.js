import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "@/shared/redux/features/mapSlice"

export const store = configureStore({
  reducer: {
    mapReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});