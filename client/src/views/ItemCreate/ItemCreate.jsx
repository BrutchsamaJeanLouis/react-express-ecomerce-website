import { Formik } from 'formik'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../ui-components/LoadingSpinner/LoadingSpinner'

export default function ItemCreate () {
  const navigate = useNavigate()
  const [fileBlobRef, setFileBlobRef] = useState([]) // File Blob reference in RAM/Memory
  const [loading, setLoading] = useState(false)

  const postItem = async (formData) => {
    // for now will be media-route ideally will post to a create-listing-route
    setLoading(true)
    const postData = {
      name: formData.name,
      location: formData.location,
      category: formData.category,
      description: formData.description,
      images: Object.assign({}, formData.images)
    }
    console.log(postData)
    await axios.post(
      '/api/item',
      postData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
      .then(res => {
        if (res.data.redirect) {
          navigate(res.data.redirect)
        }
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.response?.data?.error || err?.message)
      })

    setLoading(false)
  }

  const onchangeDisplayImages = (filesArray) => {
    if (!filesArray) return
    const fileBlobs = filesArray.map((blob) => URL.createObjectURL(blob))
    setFileBlobRef(fileBlobs)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      Post <br />
      <Formik
        initialValues={{ name: '', location: 'test', category: 'cat', description: 'desc', images: [] }}
        validate={values => {
          const errors = {}
          if (!values.images) errors.images = 'Please Upload a File'
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            postItem(values)
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
          <form onSubmit={handleSubmit}>
            <input type='text' placeholder='item name' name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} required /><br />
            <input type='text' placeholder='description' name='description' value={values.description} onChange={handleChange} onBlur={handleBlur} required /><br />
            <input type='text' placeholder='city' name='city' value={values.city} onChange={handleChange} onBlur={handleBlur} required /><br />
            <input type='text' placeholder='postcode' name='postcode' value={values.postcode} onChange={handleChange} onBlur={handleBlur} required /><br />
            {errors.images && touched.images && <span className='text-danger'>{errors.images}</span>}
            {/* Display Images */}
            {values.images &&
              fileBlobRef.map((blob, index) => (
                <div key={index}>
                  <button
                    type='button' onClick={() => {
                      // remove from fromik
                      values.images = values.images.filter((img, i) => i !== index)
                      // update image blob render
                      onchangeDisplayImages(values.images)
                    }}
                  >X
                  </button>
                  <img
                    width={200}
                    src={blob}
                  />
                </div>
              ))}
            <input
              id='images'
              name='images'
              type='file'
              multiple='multiple'
              accept='image/png, image/gif, image/jpeg, image/svg'
              onBlur={handleBlur}
              onChange={(event) => {
                const filesArray = Array.from(event.target.files)
                const existingFiles = [...values.images]
                const combinedFiles = [...existingFiles, ...filesArray]
                values.images = combinedFiles
                onchangeDisplayImages(combinedFiles)
                console.log('formik file value', values.images)
              }}
            />
            <button type='submit'>List</button>
          </form>
        )}
      </Formik>
    </div>
  )
}
