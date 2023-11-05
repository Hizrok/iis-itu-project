import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/AppStateSlice";
import menuStateSlice from "./features/MenuStateSlice";

export const store = configureStore({
    reducer: {
        appState: appStateSlice,
        menuState: menuStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;