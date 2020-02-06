import React from 'react'
import { Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import Util from '../../../UtilView'
// const electron = window.require('electron')
// const ipcRenderer = electron.ipcRenderer

export default function SessionItem (props) {
  const history = useHistory()

  function handleViewSession () {
    history.push(`/meeting/${props.meetingId}/session/${props.item.date}`)
  }
  /*
  function handleDeleteSession () {
    ipcRenderer.send('meeting.session.delete.message', {
      date: props.item.date,
      meetingId: props.meetingId
    })
  }
  */
  return (
    <div className='SessionItem'>
      <div>
        {props.item.name} - {Util.formatDateToShow(new Date(props.item.date))} - {props.item.durationInMinutes}
        &nbsp;&nbsp;
        <Button onClick={handleViewSession}>View Session</Button>
      </div>
    </div>
  )
}

//       <Button onClick={handleDeleteSession} color='danger'>Delete Session</Button>
