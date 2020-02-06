import React from 'react'
import '../../Global.css'
import logo from '../../img/logomarca_white.png'

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
