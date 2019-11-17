import React, { useState, useEffect } from 'react'
import SmallHeader from '../components/SmallHeader'
import './App.css'
import SessionItem from './components/SessionItem'
import { Button } from 'reactstrap'
import ShowError from '../../UtilView'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Meeting ({ match, history }) {
  const id = match.params.id
  const name = match.params.name
  const [data, setData] = useState([])

  useEffect(() => {
    ipcRenderer.send('meeting.session.message', { id })
    ipcRenderer.on('meeting.session.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      setData(args.data.sessions)
    })

    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('meeting.session.message.reply')
    }
  }, [])

  function handleNewSession () {
    history.push('/session/new')
  }
  function handleEndSession () {
    history.push('/')
  }
  return (
    <div>
      <SmallHeader title={name} />
      <div className='SessionsBox'>
        {data.length === 0 ? 'Opps.. you don`t have a section yet, create using the button below' : ''}
        {data.map((item, index) => (
          <SessionItem key={index} item={item} />
        ))}
      </div>
      <div className='CommandBar'>
        <Button onClick={handleNewSession}>Create Session</Button>
        &nbsp;
        <Button onClick={handleEndSession}>End Session</Button>
      </div>
    </div>
  )
}
