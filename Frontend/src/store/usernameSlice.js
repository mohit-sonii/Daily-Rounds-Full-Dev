import { createSlice } from "@reduxjs/toolkit";

const initialState={
    username:''
}
export const usernameSlice = createSlice({
    name:'usernameSlice',
    initialState,
    reducers:{
        updateCurrentUser:(state,action)=>{
            state.username=action.payload
        }
    }
})
export const {updateCurrentUser}=usernameSlice.actions

export default usernameSlice.reducer