import React, { useState, useEffect } from 'react'
import SmallHeader from '../components/SmallHeader'
import './App.css'
import SessionItem from './components/SessionItem'
import { Button } from 'reactstrap'
import ShowError from '../../UtilView'
import NewSession from './components/NewSession'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Meeting ({ match, history }) {
  const id = match.params.id
  const [name, setName] = useState([])
  const [data, setData] = useState([])
  const [modalSession, setModalSession] = useState(false)

  useEffect(() => {
    ipcRenderer.send('meeting.session.message', { id })
    ipcRenderer.on('meeting.session.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      setName(args.data.name)
      setData(args.data.sessions)
    })
    ipcRenderer.on('meeting.session.create.message.reply', (event, args) => {
      setModalSession(false)
      if (args.error) {
        ShowError(args)
      }
    })

    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('meeting.session.message.reply')
      ipcRenderer.removeAllListeners('meeting.session.create.message.reply')
    }
  }, [])

  function handleNewSession () {
    setModalSession(!modalSession)
  }

  function handleEndMeeting () {
    ipcRenderer.send('meeting.end.message')
    history.push('/')
  }

  return (
    <div>
      <SmallHeader title={name} />
      <div className='SessionsBox'>
        {data.length === 0 ? 'Opps.. you don`t have a section yet, create using the button below' : ''}
        {data.map((item, index) => (
          <SessionItem key={index} item={item} meetingId={id} />
        ))}
      </div>
      <div className='CommandBar'>
        <Button onClick={handleNewSession}>Create Session</Button>
        &nbsp;
        <Button onClick={handleEndMeeting}>End Meeting</Button>
      </div>
      {modalSession ? <NewSession close={handleNewSession} /> : ''}
    </div>
  )
}
