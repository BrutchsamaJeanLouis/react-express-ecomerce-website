import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  authTryer: null
}

export const authSlice = createSlice({
  name: 'auth', // name of the key in state
  initialState,
  reducers: {
    setSessionUser: (state, action) => {
      state.user = action.payload
    },
    setAuthTryer: (state, action) => {
      state.authTryer = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setSessionUser,
  setAuthTryer
} = authSlice.actions

export default authSlice.reducer
