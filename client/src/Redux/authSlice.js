// store/slice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserReviews } from '../http/userApi';

const initialState = {
  isAuth: false,
  user: {},
  userRole:'',
  userReviews:[],
};

export const getAllUserReviews = createAsyncThunk("tour/fetchReviews", async () => {
  try{
    const response = await getUserReviews();
    console.log(response)
    return response;
  }
  catch(error){
    console.error("Error fetching tours", error);
    throw error;
  }
})


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
    },
    setUserReviews:(state,action) => {
      state.userReviews = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUserReviews.fulfilled, (state, action) => {
      state.userReviews = action.payload;
    });
  }
});

export const { setIsAuth, setUser, setUserRole, setUserReviews } = authSlice.actions;
export const selectIsAuth = (state) => state.auth.isAuth;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.userRole
export const selectUserReviews = (state) => state.auth.userReviews

export default authSlice.reducer;
