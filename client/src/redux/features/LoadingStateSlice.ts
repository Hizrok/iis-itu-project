// @author Tomáš Vlach

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Keeps value for loading screen animation lock

type loadingState = {
    loadingState: boolean;
};

const initialState: loadingState = {
    loadingState: false
};

export const loadingStateSlice = createSlice({
    name: "loadingState",
    initialState,
    reducers: {
    setLoadingState: (state, action: PayloadAction<boolean>) => {
        state.loadingState = action.payload;
    }
    }
});

export const {
    setLoadingState
} = loadingStateSlice.actions;

export default loadingStateSlice.reducer;