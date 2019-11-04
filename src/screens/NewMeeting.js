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
  const [directory, setDirectory] = useState('')

  function handleToggle () {
    console.log('hit toogle')
    setModal(!modal)
  }
  function handleSaveMeeting () {
    ipcRenderer.send('setup.create.message', { alias: alias, dbPath: directory })
    setModal(!modal)
  }
  function handleDirectoryChange (evt) {
    setDirectory(evt.target.value)
  }
  function handleNameChange (evt) {
    setAlias(evt.target.value)
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Setup new Meeting</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
            <Input name='name' value={alias} type='text' onChange={handleNameChange} placeholder='What is the name? (e.g Team Meeting, Project X Status)' />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Folder</InputGroupAddon>
            <Input name='directory' value={directory} type='text' onChange={handleDirectoryChange} placeholder='Copy and paste the folder location' />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={handleToggle}>Cancel</Button>
          <Button color='primary' onClick={handleSaveMeeting}>Save</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  )
}
