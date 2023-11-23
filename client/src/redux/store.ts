import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/AppStateSlice";
import loadingStateSlice from "./features/LoadingStateSlice";

export const store = configureStore({
    reducer: {
        appState: appStateSlice,
        loadingState: loadingStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;