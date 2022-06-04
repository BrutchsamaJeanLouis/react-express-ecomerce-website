import axios from 'axios'
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAuthTryer } from '../../reduxSlices/authSlice';
import { setLastRestrictedPath } from '../../reduxSlices/navigationSlice'
import Navbar from '../../ui-components/Navbar/Navbar';
import logo from '../../images/logo.png'

export default function Login () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const registerConfirmResult = searchParams.get('register_confirm')
  const lastRestrictedPath = useSelector((rootRedux) => rootRedux.navigation.lastRestrictedPath)
  useEffect(() => {
    if (registerConfirmResult === 'passed') setMessage('Verification Success') // toast.success('Verification Success')
  }, [])

  // TODO Nadwine
  // after a failed login attempt then a successful login attempt both error and success message display together
  const doLogin = async (formData) => {
    const { email, password } = formData
    dispatch(setAuthTryer(email))
    await axios.post('/api/login', { email: email, password: password, attemptedUrl: lastRestrictedPath })
      .then(res => {
        // Redirect handled by interceptor
        console.log(res)
        if (res.response?.data?.successLoginRedirect) {
          setMessage('Login Success!') // Message state
        }
      })
      .catch((err) => {
        console.log(err)
        setError(err.response?.data?.error || err?.message)
        // toast.error(err.response?.data?.error || err?.message)
      })
  }

  return (
    <div>
      {/* Reserved Space for NavBar But will not show a navbar in login screen */}
      <div className='row'><button className='btn btn-primary-outline float-start fs-1' style={{ maxWidth: '70px' }} onClick={() => window.history.back()}><i className='bi bi-arrow-left-circle'/></button></div>
      <div className='container-fluid main-content'>
        <img src={logo} style={{ width: '100px' }}></img>
        <h1 className='mt-3' style={{ textAlign: 'center' }}>Login</h1>
        <div className='d-flex justify-content-center' style={{ flexDirection: 'column' }}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors = {}
              return errors
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                doLogin(values)
                setSubmitting(false)
              }, 400)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
              /* and other goodies */
            }) => (
              <div className='m-auto'>
                <form className='mt-3' style={{ minWidth: '400px', width: '60%' }} onSubmit={handleSubmit}>
                  <div className='text-danger'>{error}</div>
                  <div className='text-success'>{message}</div>
                  <div class="mb-3 mt-5">
                    {/* <label for="exampleInputEmail1" class="form-label">Email address</label> */}
                    <input type='text' className='login-email-input form-control' style={{ fontFamily: 'bootstrap-icons' }} placeholder='&#xF32F;     Email' name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} required />
                    <div id="emailHelp" class="form-text">Enter your email or username</div>
                  </div>
                  <div class="mb-3 mt-3">
                    {/* <label for="exampleInputPassword1" class="form-label">Password</label> */}
                    <input type='password' className='login-password-input form-control' style={{ fontFamily: 'bootstrap-icons' }} placeholder='&#xF47B;    Password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} required />
                  </div>
                  <button  className='btn btn-primary float-end rounded-pill mt-4' type='submit'>Login &nbsp; <i class="bi bi-arrow-right" /></button>
                </form>
              </div>
            )}
          </Formik>
          <div className='mt-4'>
            Don't have an account? <Link to='/register'>register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
