import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/AppStateSlice";
import loadingStateSlice from "./features/LoadingStateSlice";
import loadingContentStateSlice from "./features/LoadingContentStateSlice";

export const store = configureStore({
    reducer: {
        appState: appStateSlice,
        loadingState: loadingStateSlice,
        loadingContetnState: loadingContentStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;