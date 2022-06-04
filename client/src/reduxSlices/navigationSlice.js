import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lastRestrictedPath: null,
  mobileNavOpened: false
}

export const navigationSlice = createSlice({
  name: 'navigation', // name of the key in state
  initialState,
  reducers: {
    setLastRestrictedPath: (state, action) => {
      state.lastRestrictedPath = action.payload
    },
    setMobileNavOpened: (state, action) => {
      state.mobileNavOpened = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setLastRestrictedPath,
  setMobileNavOpened
} = navigationSlice.actions

export default navigationSlice.reducer
