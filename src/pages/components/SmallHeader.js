import React from 'react'
import '../../App.css'
import logo from '../../img/logo.png'

export default function SmallHeader (props) {
  return (
    <div className='App-SmallHeader'>
      <img src={logo} className='App-logo-Small' alt='logo' />
      <span className='App-logo-small-text'>
      |&nbsp;&nbsp;{props.title}
      </span>
    </div>
  )
}
