import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Input,
  Label,
  InputGroupText
} from 'reactstrap'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function NewItem (props) {
  const [modal, setModal] = useState(true)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [time, setTime] = useState(0)
  const [recurrent, setRecurrent] = useState(false)

  function handleToggle () {
    setModal(!modal)
    props.close()
  }
  function handleSave () {
    ipcRenderer.send('session.item.create.message', {
      name,
      owner,
      time,
      recurrent
    })
    setModal(!modal)
    props.close()
  }
  function handleNameChange (evt) {
    setName(evt.target.value)
  }
  function handleOwnerChange (evt) {
    setOwner(evt.target.value)
  }
  function handleTimeChange (evt) {
    setTime(Number(evt.target.value))
  }
  function handleRecurrentChange (evt) {
    setRecurrent(!recurrent)
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle} autoFocus={false}>
        <ModalHeader toggle={handleToggle}>Create a new item</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
            <Input
              name='name' value={name} autoFocus
              type='text' onChange={handleNameChange}
              placeholder='Item to be discussed'
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Owner</InputGroupAddon>
            <Input
              name='name' value={owner}
              type='text' onChange={handleOwnerChange}
              placeholder='How is the responsible for this item?'
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Duration</InputGroupAddon>
            <Input
              name='name' value={time}
              type='number' onChange={handleTimeChange}
              placeholder='What is the duration in minutes?'
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Input addon type='checkbox' value={recurrent} onChange={handleRecurrentChange} />
              </InputGroupText>
            </InputGroupAddon>
            <Label>Recurrent</Label>
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
