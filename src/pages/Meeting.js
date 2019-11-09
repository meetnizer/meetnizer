import React, { useState, useEffect } from 'react'
import Header from './Header'
import '../App.css'
import Session from './Session'
import { Button } from 'reactstrap'

export default function Meeting ({ match, history }) {
  const [data, setData] = useState([])

  useEffect(() => {
    setData([
      { name: 'name1' }
    ])
  }, [])
  function handleNewSession () {
    setData(data.push({ name: 'name2' }))
  }
  function handleEndSession () {
    history.push('/')
  }
  return (
    <div>
      <Header title={match.params.id} />
      <div className='SessionsBox'>
        {data.length === 0 ? 'Opps.. you don`t have a section yet, create using the button below' : ''}
        {data.map(item => (
          <Session key={item.name} item={item} />
        ))}
      </div>
      <div className='CommandBar'>
        <Button onClick={handleNewSession}>Create Session</Button>
        <Button onClick={handleEndSession}>End Session</Button>
      </div>
    </div>
  )
}
