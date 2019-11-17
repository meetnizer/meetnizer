import React from 'react'
import '../App.css'

export default function SessionItem (props) {
  return (
    <div className='SessionItem'>{props.item.name}</div>
  )
}
