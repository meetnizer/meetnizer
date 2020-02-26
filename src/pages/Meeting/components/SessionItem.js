import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Util from '../../../UtilView'
import {
  MdRemoveRedEye,
  MdRemoveCircle
} from 'react-icons/md'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function SessionItem (props) {
  const history = useHistory()

  useEffect(() => {
    ipcRenderer.on('meeting.session.delete.message.reply', (event, args) => {
      if (args.error) {
        Util.showError(args)
      }
    })

    return () => {
      ipcRenderer.removeAllListeners('meeting.session.delete.message.reply')
    }
  }, [])

  function handleViewSession () {
    history.push(`/meeting/${props.meetingId}/session/${props.item.date}`)
  }

  function handleDeleteSession () {
    ipcRenderer.send('meeting.session.delete.message', {
      date: props.item.date,
      meetingId: props.meetingId
    })
  }

  return (
    <div className='SessionItem'>
      <div className='SessionItemFirst'>
        {Util.formatDateToShow(new Date(props.item.date))} - {props.item.durationInMinutes} minutes
      </div>
      <div className='SessionItemSecond'>
        <MdRemoveRedEye className='ActionIcon' onClick={handleViewSession} />
        <MdRemoveCircle className='ActionIconRed' onClick={handleDeleteSession} />
      </div>
    </div>
  )
}

//       <Button onClick={handleDeleteSession} color='danger'>Delete Session</Button>
