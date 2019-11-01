import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

export default function NewMeeting () {
  const [modal, setModal] = useState(true)

  function handleToggle () {
    console.log('hit toogle')
    setModal(!modal)
  }
  function handleSaveMeeting () {
    console.log('hit save')
    setModal(false)
  }
  return (
    <div>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Setup new Meeting</ModalHeader>
        <ModalBody>
            Select the path to save the meeting files
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleSaveMeeting}>Save</Button>{' '}
          <Button color='secondary' onClick={handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
