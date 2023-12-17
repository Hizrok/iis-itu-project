// @author Tomáš Vlach

import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/AppStateSlice";
import loadingStateSlice from "./features/LoadingStateSlice";
import loadingContentStateSlice from "./features/LoadingContentStateSlice";

// Creates a redux const with states for cross page variables

export const store = configureStore({
    reducer: {
        appState: appStateSlice,
        loadingState: loadingStateSlice,
        loadingContetnState: loadingContentStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;