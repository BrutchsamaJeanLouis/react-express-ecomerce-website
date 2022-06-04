import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import logo from '../images/logo.png'

export default function Register () {
  const navigate = useNavigate()

  const submitRegistration = async (formData) => {
    return
    await axios.post('/api/register', {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    })
      .then(res => {
        if (res.data.redirect) {
          navigate(res.data.redirect)
        }
        console.log(res)
      })
      .catch(err => {
        toast.error(err.response.data.error)
        console.log(err)
      })
  }

  function hasUpperCase (str) {
    return (/[A-Z]/.test(str))
  }

  function containsSpecialChars (str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    return specialChars.test(str)
  }

  function containsNumber (str) {
    const numbers = /[0123456789]/
    return numbers.test(str)
  }

  return (
    <div>
      {/* Reserved Space for NavBar But will not show a navbar in login screen */}
      <div className='row'><button className='btn btn-primary-outline float-start fs-1' style={{ maxWidth: '70px' }} onClick={() => window.history.back()}><i className='bi bi-arrow-left-circle' /></button></div>
      <div className='container-fluid main-content'>
        <img src={logo} width={100} />
        <h1 className='mt-3' style={{ textAlign: 'center' }}>Register</h1>
        <div className='d-flex justify-content-center' style={{ flexDirection: 'column' }}>
          <Formik
            initialValues={{ username: '', email: '', firstName: '', lastName: '', password: '', confirmPassword: '' }}
            validate={values => {
              const errors = {}
              if (!values.email) {
                errors.email = 'Required'
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address'
              }
              // TODO Strong password validation
              if (values.password !== values.confirmPassword) {
                errors.password = 'Passwords must match'
              }
              if (values.password.length < 8) {
                errors.password = 'Password must contain at least 8 characters'
              }
              if (!hasUpperCase(values.password)) {
                errors.password = 'Password must contain at least 1 capital letter'
              }
              if (!containsSpecialChars(values.password)) {
                errors.password = 'Password must contain at least 1 symbol'
              }
              if (!containsNumber(values.password)) {
                errors.password = 'Password must contain at least 1 number'
              }
              return errors
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                submitRegistration(values)
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
              /* TODO validation visuals*/ 
            }) => (
              <div className='m-auto'>
                <form className='mt-3' style={{ minWidth: '400px', width: '60%' }} onSubmit={handleSubmit}>
                  {errors.email && touched.email && errors.email}
                  <input type='text' className='login-email-input form-control' placeholder='Username' name='username' value={values.username} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <input type='text' className='login-email-input form-control' placeholder='Email' name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <input type='text' className='login-email-input form-control' placeholder='First Name' name='firstName' value={values.firstName} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <input type='text' className='login-email-input form-control' placeholder='Last Name' name='lastName' value={values.lastName} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <div className='text-danger'>{errors.password && touched.password && errors.password}</div>
                  <input type='text' className='login-password-input form-control' placeholder='Password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <input type='text' className='login-password-input form-control' placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} required /><br />
                  <button type='submit' className='btn btn-primary float-end rounded-pill mt-4'>Register</button>
                </form>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
