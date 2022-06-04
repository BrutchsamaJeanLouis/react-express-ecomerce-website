import React from 'react'

export default function LoadingSpinner () {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ width: '100vw', height: '70vh' }}>
      <div class='spinner-border' role='status'>
        <span class='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
