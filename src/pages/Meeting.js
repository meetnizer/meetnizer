import React from 'react'
import Header from './Header'
import '../App.css'
import Session from './Session'

export default function Meeting ({ match }) {
  return (
    <div>
      <Header title={match.params.id} />
      <div className='SessionsBox'>
        <Session id='1' title='a' />
        <Session id='2' title='b' />
        <Session id='3' title='c' />
      </div>
      <div className='CommandBar'>
        create session
      </div>
    </div>
  )
}
