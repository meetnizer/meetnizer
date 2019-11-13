import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import '../App.css'
import Session from './Session'
import { Button } from 'reactstrap'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Meeting ({ match, history, location }) {
  const id = match.params.id
  const name = match.params.name
  const [data, setData] = useState([])

  useEffect(() => {
    ipcRenderer.send('meeting.session.message', { id })
    ipcRenderer.on('meeting.session.message.reply', (event, args) => {
      console.log(JSON.stringify(args))
    })

    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('meeting.session.message.reply')
    }
  }, [])

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
      <Header title={name} />
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
