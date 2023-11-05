import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type menuState = {
    menuState: boolean;
};

const initialState: menuState = {
    menuState: false
};

export const menuStateSlice = createSlice({
    name: "menuState",
    initialState,
    reducers: {
    setmenuState: (state, action: PayloadAction<boolean>) => {
        state.menuState = action.payload;
    }
    }
});

export const {
    setmenuState
} = menuStateSlice.actions;

export default menuStateSlice.reducer;