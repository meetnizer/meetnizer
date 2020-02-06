import React, { useEffect, useState } from 'react'
import Util from '../../UtilView'
import NewItem from './components/NewItem'
import Header from './components/Header'
import { Button } from 'reactstrap'
import Item from './components/Item'
import SmallHeader from '../components/SmallHeader'
import './App.css'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Session ({ match, history }) {
  const meetingId = match.params.id
  const sessionDate = match.params.date
  const [meetingName, setMeetingName] = useState('')
  const [items, setItems] = useState([])
  const [modalItem, setModalItem] = useState(false)
  const [running, setRunning] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  useEffect(() => {
    ipcRenderer.send('session.items.message', { sessionDate })
    ipcRenderer.on('session.items.message.reply', (event, args) => {
      if (args.error) {
        Util.ShowError(args)
        setItems([])
        return
      }
      setItems(args.data.items)
      setMeetingName(args.data.meetingName)
      setSessionDuration(args.data.durationInMinutes)
    })
    ipcRenderer.on('session.item.create.message', (event, args) => {
      if (args.error) {
        Util.ShowError(args)
      }
    })
    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('session.items.message.reply')
    }
  }, [])

  function backToSessionList () {
    history.push(`/meeting/${meetingId}`)
  }

  function handleNewItem () {
    setModalItem(!modalItem)
  }
  function handleStartSession () {
    setRunning(true)
  }
  function handleEndSession () {
    setRunning(false)
  }

  return (
    <div>
      <SmallHeader title={meetingName + ' - ' + Util.formatDateToShow(new Date(sessionDate))} />
      <div className='ItemBox'>
        {items.length === 0 ? 'Opps.. you don`t have items to your meeting, create using the button below' : ''}
        {items.length > 0 ? <Header items={items} sessionDuration={sessionDuration} /> : ''}
        {items.map((item, index) => (
          <Item data={item} key={index} />
        ))}
      </div>
      <div className='SessionButtomBar'>
        {!running ? <Button onClick={backToSessionList}>Back to session list</Button> : ''}
        &nbsp;&nbsp;&nbsp;
        <Button onClick={handleNewItem}>New Item</Button>
        &nbsp;&nbsp;&nbsp;
        {!running ? <Button onClick={handleStartSession} color='success'>Start Session</Button> : ''}
        &nbsp;&nbsp;&nbsp;
        {running ? <Button onClick={handleEndSession} color='danger'>End Session</Button> : ''}
      </div>
      {modalItem ? <NewItem close={handleNewItem} /> : ''}
    </div>
  )
}
