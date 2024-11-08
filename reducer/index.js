import { createSlice } from "@reduxjs/toolkit";
// Slice
const userslice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.user = null;
    },
  },
});
export const { loginSuccess, logoutSuccess } = userslice.actions;

export default userslice.reducer;
