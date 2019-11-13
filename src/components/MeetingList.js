import React, { useState, useEffect } from 'react'
import ShowError from '../UtilView'
import { Button } from 'reactstrap'
import NewMeeting from '../modal/NewMeeting'
import { useHistory } from 'react-router-dom'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const MeetingList = (props) => {
  const history = useHistory()
  const [meetingList, setMeetingList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  // equivalent to componentWillMount
  useEffect(() => {
    ipcRenderer.send('workspace.getmeetings.message', { alias: props.data.alias })
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
      redirect(args.data.meetingId)
    })
    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('workspace.getmeetings.message.reply')
      ipcRenderer.removeAllListeners('meeting.create.message.reply')
    }
  }, [])
  function redirect (meetingId) {
    console.log(meetingId)
    history.push(`/meeting/${meetingId}`)
  }
  function handleClick (meetingId) {
    console.log('not implemented', meetingId)
  }
  function handleCreateMeeting () {
    setOpenModal(true)
  }
  return (
    <div>
      {!meetingList || meetingList.length === 0 ? <h5>Select a meeting:</h5> : ''}
      <br />
      {meetingList && meetingList.map((item, index) => (
        <h6 key={index}>
          <a href='#' onClick={() => handleClick(item._id)}>{item.name}</a>
        </h6>
      ))}
      <Button onClick={() => handleCreateMeeting()}>Create a meeting</Button>
      {openModal ? <NewMeeting /> : ''}
    </div>
  )
}

export default MeetingList
