import React from 'react'
import '../App.css'

export default function Session (props) {
  return (
    <div className='SessionItem'>{props.id} - {props.title}</div>
  )
}
