// store/slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: {},
  userRole:'',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserRole:(state,action) => {
      state.userRole = action.payload
    }
  },
});

export const { setIsAuth, setUser, setUserRole } = authSlice.actions;
export const selectIsAuth = (state) => state.auth.isAuth;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.userRole

export default authSlice.reducer;
