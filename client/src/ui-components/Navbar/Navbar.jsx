import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMobileNavOpened } from '../../reduxSlices/navigationSlice'

export default function Navbar () {
  const dispatch = useDispatch()
  const mobileNavOpened = useSelector(reduxRoot => reduxRoot.navigation.mobileNavOpened)
  console.log('mobilenavopen', mobileNavOpened)

  return (
    <div>
      <nav id='navbar_main' className={`mobile-offcanvas navbar navbar-expand-lg navbar-dark ${mobileNavOpened === false && 'fixed-top'} bg-primary ${mobileNavOpened && 'show'}`}>
        <div className='container-fluid'>
          <div className='offcanvas-header'>
            <button className='btn-close float-end' onClick={() => dispatch(setMobileNavOpened(false))} />
          </div>
          <a className='navbar-brand text-white' href='#'>Logo</a>
          <ul className='navbar-nav'>
            <li className='nav-item active'> <a className='nav-link' href='#'>Home </a> </li>
            <li className='nav-item'><a className='nav-link' href='#'> About </a></li>
            <li className='nav-item'><a className='nav-link' href='#'> Services </a></li>
            <li className='nav-item dropdown'>
              <a className='nav-link  dropdown-toggle' href='#' data-bs-toggle='dropdown'>  More items  </a>
              <ul className='dropdown-menu'>
                <li><a className='dropdown-item' href='#'> Submenu item 1</a></li>
                <li><a className='dropdown-item' href='#'> Submenu item 2 </a></li>
                <li><a className='dropdown-item' href='#'> Submenu item 3 </a></li>
              </ul>
            </li>
          </ul>
          <ul className='navbar-nav ms-auto'>
            <li className='nav-item'><a className='nav-link' href='#'> Menu item </a></li>
            <li className='nav-item'><a className='nav-link' href='#'> Menu item </a></li>
            <li className='nav-item dropdown'>
              <a className='nav-link  dropdown-toggle' href='#' data-bs-toggle='dropdown'> Dropdown right </a>
              <ul className='dropdown-menu dropdown-menu-end'>
                <li><a className='dropdown-item' href='#'> Submenu item 1</a></li>
                <li><a className='dropdown-item' href='#'> Submenu item 2 </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div className='d-lg-none position-absolute bg-primary' style={{ width: '100%', height: '55px' }}>
        {mobileNavOpened === false && <button class="btn btn-lg btn-primary-outline float-start fs-1" type="button" onClick={() => dispatch(setMobileNavOpened(!mobileNavOpened))}><i class="bi bi-list text-light" /></button>}
        <div className='logo-mobile text-light'><strong className='fs-2'>Logo</strong></div>
      </div>
    </div>
  )
}
