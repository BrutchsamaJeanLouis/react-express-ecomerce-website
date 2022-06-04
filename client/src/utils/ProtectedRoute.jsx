import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { setLastRestrictedPath } from '../reduxSlices/navigationSlice'
import { store } from '../store'
import verifyAuthState from './verifyAuthState'
// import React from 'react'

export const ProtectedRoute = ({ roles, redirectPath = '/login', children }) => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  // this auth state is managed and updated by verifyAuthState in utils
  // this is programtically called on navigating new routes
  // to make sure its alays up to date. incase session expires
  useEffect(() => {
    verifyAuthState().then(() => setLoading(false))
  }, [])
  const authState = store.getState().auth

  if (loading) {
    // TODO replace with loading component
    return ( <div>loading</div> )
  }
  // role props is an array or allowed roles
  if (!roles.find(role => role === authState.user?.accountType)) {
    dispatch(setLastRestrictedPath(window.location.pathname))
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}
