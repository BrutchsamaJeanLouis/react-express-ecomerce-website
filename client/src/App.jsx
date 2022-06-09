import { useEffect, useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Route, Routes } from 'react-router-dom'
import Login from './views/Login/Login'
import Register from './views/Register/Register'
import axios from 'axios'
import { ProtectedRoute } from './utils/ProtectedRoute'
import verifyAuthState from './utils/verifyAuthState'
axios.defaults.withCredentials = true

// TODO sync progmatically with backend
// https://lifesaver.codes/answer/need-some-advice-about-handling-302-redirects-from-ajax
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  // handle a successfull login separately (coming in as an error because axios only recognizes status 200 as success callback)
  if (error.response && error.response.data && error.response.data.successLoginRedirect) {
    // only will redirect  after some seconds to allow user some time to see success message
    setTimeout(() => { window.location = error.response.data.redirect }, 2000)
    return Promise.resolve(error)
  }
  // Here we will intercept every axios request to check if the server is telling us to redirect
  if (error.response && error.response.data && error.response.data.redirect) {
    // if server send redirect. change the browser url location
    // To ignore this and do something before a redirect (recommend using fetch for those cases)
    window.location = error.response.data.redirect
  }

  return Promise.reject(error)
})
// On every Request also sends the the last and current browserURL to API from redirecting purposes
axios.interceptors.request.use((request) => {
  // if there was no previous url to send the user back to
  if (!document.referrer) return request

  request.headers.lastbrowserpath = document.referrer.substring(window.location.origin.length)
  request.headers.currentbrowserpath = window.location.pathname

  return request
}, (error) => {
  return Promise.reject(error)
})
// Dynamic MetaTags with react-helmet
// https://stackoverflow.com/questions/70242989/how-to-use-dynamic-meta-tags-in-react-single-page-application
function App () {
  useEffect(() => {
    verifyAuthState().then(() => console.log('initial Mount auth verified'))
  }, [])

  // return JSX
  return (
    <div className='App'>
      <ToastContainer />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
