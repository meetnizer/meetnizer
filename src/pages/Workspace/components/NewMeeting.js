import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Input
} from 'reactstrap'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function NewMeeting (props) {
  const [modal, setModal] = useState(true)
  const [alias, setAlias] = useState('')

  function handleToggle () {
    setModal(!modal)
    props.close()
  }
  function handleSave () {
    ipcRenderer.send('meeting.create.message', { name: alias })
    setModal(!modal)
    props.close()
  }
  function handleNameChange (evt) {
    setAlias(evt.target.value)
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle} autoFocus={false}>
        <ModalHeader toggle={handleToggle}>Create a new meeting</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
            <Input
              name='name' value={alias} autoFocus
              type='text' onChange={handleNameChange}
              placeholder='What is the name? (e.g Team Meeting, Project X Status)'
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={handleToggle}>Cancel</Button>
          <Button color='primary' onClick={handleSave}>Save</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  )
}
