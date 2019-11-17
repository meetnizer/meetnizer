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

export default function NewWorkspace (props) {
  const [modal, setModal] = useState(true)
  const [alias, setAlias] = useState('')
  const [directory, setDirectory] = useState('')

  function handleToggle () {
    setModal(!modal)
    props.close()
  }
  function handleSave () {
    ipcRenderer.send('setup.create.workspace.message', { alias: alias, dbPath: directory })
    setModal(!modal)
    props.close()
  }
  function handleDirectoryChange (evt) {
    setDirectory(evt.target.value)
  }
  function handleNameChange (evt) {
    setAlias(evt.target.value)
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle} autoFocus={false}>
        <ModalHeader toggle={handleToggle}>Create a new workspace</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
            <Input
              name='name' value={alias} type='text'
              autoFocus onChange={handleNameChange}
              placeholder='What is the name? (e.g Tech, Marketing, Projects)'
            />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Folder</InputGroupAddon>
            <Input
              name='directory' value={directory}
              type='text' onChange={handleDirectoryChange}
              placeholder='Copy and paste the folder location'
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
