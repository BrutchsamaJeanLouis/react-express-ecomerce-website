import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reduxSlices/authSlice'
import navigationSlice from './reduxSlices/navigationSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    navigation: navigationSlice
  },
})
