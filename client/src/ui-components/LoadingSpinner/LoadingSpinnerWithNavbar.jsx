import React from 'react'
import Navbar from '../Navbar/Navbar'

export default function LoadingSpinnerWithNavbar () {
  return (
    <div>
      <Navbar />
      <div className='container-fluid main-content'>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100vw', height: '70vh' }}>
          <div class='spinner-border' role='status'>
            <span class='visually-hidden'>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
