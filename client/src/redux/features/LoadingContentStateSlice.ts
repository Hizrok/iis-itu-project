import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type loadingContentState = {
    loadingContentState: boolean;
};

const initialState: loadingContentState = {
    loadingContentState: false
};

export const loadingContentStateSlice = createSlice({
    name: "loadingContentState",
    initialState,
    reducers: {
    setLoadingContentState: (state, action: PayloadAction<boolean>) => {
        state.loadingContentState = action.payload;
    }
    }
});

export const {
    setLoadingContentState
} = loadingContentStateSlice.actions;

export default loadingContentStateSlice.reducer;