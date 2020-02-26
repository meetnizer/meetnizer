import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Popover,
  PopoverBody
} from 'reactstrap'
import {
  MdInfo
} from 'react-icons/md'
import Util from '../../../UtilView'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function NewSession (props) {
  const [modal, setModal] = useState(true)
  // const [name, setName] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(new Date())
  const [copyLastSession, setCopyLastSession] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const toggle = () => setPopoverOpen(!popoverOpen)

  function handleToggle () {
    setModal(!modal)
    props.close()
  }
  function handleCopyLastSessionChange (evt) {
    setCopyLastSession(!copyLastSession)
  }
  function handleSave () {
    ipcRenderer.send('meeting.session.create.message', {
      name: '',
      duration,
      date,
      copyLastSession
    })
    setModal(!modal)
    props.close()
  }
  /*
  function handleNameChange (evt) {
    setName(evt.target.value)
  } */

  function handleDurationChange (evt) {
    setDuration(evt.target.value)
  }

  function handleDateChange (evt) {
    const d = evt.target.value
    if (d) {
      const value = d.split('-')
      var dataTemp = new Date()
      dataTemp.setFullYear(value[0], value[1] - 1, value[2])
      setDate(dataTemp)
    }
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle} autoFocus={false}>
        <ModalHeader toggle={handleToggle}>Create a new session</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Duration</InputGroupAddon>
            <Input
              name='name' value={duration}
              type='number' onChange={handleDurationChange}
              placeholder='What is the duration in minutes?'
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>Date</InputGroupAddon>
            <Input
              name='name' value={Util.formatDate(date)}
              type='date' onChange={handleDateChange}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Input addon type='checkbox' value={copyLastSession} onChange={handleCopyLastSessionChange} />
              </InputGroupText>
            </InputGroupAddon>
            <Label>Copy Last Session ?</Label>
            <MdInfo id='recurrentItem' className='ActionIcon' />
            <Popover placement='left' isOpen={popoverOpen} target='recurrentItem' toggle={toggle}>
              <PopoverBody>When marked indicates this new session will copy all itens from the last session</PopoverBody>
            </Popover>
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

/*
  <InputGroup>
    <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
    <Input
      name='name' value={name} autoFocus
      type='text' onChange={handleNameChange}
      placeholder='What is the name?'
    />
  </InputGroup>
*/
