import React, { useState, useEffect } from 'react'
import ShowError from '../../../UtilView'
import { Button } from 'reactstrap'
import NewMeeting from './NewMeeting'
import { useHistory } from 'react-router-dom'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const MeetingList = (props) => {
  const history = useHistory()
  const [meetingList, setMeetingList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  // equivalent to componentWillMount
  useEffect(() => {
    ipcRenderer.send('workspace.getmeetings.message', { alias: props.data })
    ipcRenderer.on('workspace.getmeetings.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      console.log('list of meetings', args.data)
      setMeetingList(args.data)
    })
    ipcRenderer.on('meeting.create.message.reply', (event, args) => {
      setOpenModal(false)
      if (args.error) {
        ShowError(args)
        return
      }
      redirect(args.data.id, args.data.name)
    })
    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('workspace.getmeetings.message.reply')
      ipcRenderer.removeAllListeners('meeting.create.message.reply')
    }
  }, [])
  function redirect (meetingId, meetingName) {
    history.push(`/meeting/${meetingId}/${meetingName}`)
  }
  function handleCreateMeeting () {
    setOpenModal(!openModal)
  }
  return (
    <div>
      <Button onClick={() => handleCreateMeeting()}>Create a meeting</Button>
      <br />
      <br />
      {!meetingList || meetingList.length > 0 ? <h5>Select a meeting:</h5> : ''}
      <br />
      {meetingList && meetingList.map((item, index) => (
        <h6 key={index}>
          <a href='#' onClick={() => redirect(item._id, item.name)}>{item.name}</a>
        </h6>
      ))}
      {openModal ? <NewMeeting close={handleCreateMeeting} /> : ''}
    </div>
  )
}

export default MeetingList
