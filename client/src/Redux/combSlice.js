import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCombs } from "../http/combApi";

const initialState = {
    combs: [],
}

export const fetchCombToursAsync = createAsyncThunk("combs/fetchCombs", async () => {
    try{
      const response = await fetchCombs();
      return response.data;
    }
    catch(e){
      console.log(e.message);
    }
})


const combTourSlice = createSlice({
    name: "combTour",
    initialState,
    reducers: {
        addCombTour(state, action) {
            return {
                ...state,
                combs: [...state.combs, {
                    id: new Date().toISOString(),
                }]
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCombToursAsync.fulfilled, (state, action) => {
                state.combs = action.payload; // Обновляем отели напрямую
            });
    }
});
  
  
export const selectCombTours = (state) => state.combTour.combs;
export default combTourSlice.reducer