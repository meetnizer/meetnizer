import React from 'react'
import {
  MdArrowUpward,
  MdArrowDownward,
  MdRemoveCircle,
  MdCheckBoxOutlineBlank,
  MdCheckBox
} from 'react-icons/md'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Item (props) {
  function moveUp () {
    ipcRenderer.send('session.item.message', {
      _id: props.data._id,
      action: 'moveup'
    })
  }
  function moveDown () {
    ipcRenderer.send('session.item.message', {
      _id: props.data._id,
      action: 'movedown'
    })
  }
  function remove () {
    ipcRenderer.send('session.item.message', {
      _id: props.data._id,
      action: 'remove'
    })
  }
  function done () {
    ipcRenderer.send('session.item.message', {
      _id: props.data._id,
      action: 'done'
    })
  }
  return (
    <div className='ItemArea'>
      <div className='ItemAreaFirst'>
        {props.data.done
          ? <MdCheckBox className='ActionIcon' onClick={() => done()} />
          : <MdCheckBoxOutlineBlank className='ActionIcon' onClick={() => done()} />}
      </div>
      <div className='ItemAreaSecond'>
        {props.data.name} - {props.data.time} - {props.data.owner}
        <br /> Number of sessions: {props.data.sessions.length}
      </div>
      <div className='ItemAreaThird'>
        <MdArrowUpward className='ActionIcon' onClick={() => moveUp()} />
        <MdArrowDownward className='ActionIcon' onClick={() => moveDown()} />
        <MdRemoveCircle className='ActionIconRed' onClick={() => remove()} />
      </div>
    </div>
  )
}
