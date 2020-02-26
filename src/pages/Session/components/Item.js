import React from 'react'
import {
  MdArrowUpward,
  MdArrowDownward,
  MdRemoveCircle,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdStar
} from 'react-icons/md'
import ItemGauge from './ItemGauge'
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
      action: 'done',
      status: !props.data.done
    })
  }
  function drawActions () {
    if (props.data.recurrent) {
      return false
    }
    return true
  }

  return (
    <div className='ItemArea'>
      <div className='ItemAreaFirst'>
        {drawActions() === false
          ? <MdStar className='ActionIcon' />
          : props.data.done
            ? <MdCheckBox className='ActionIcon' onClick={() => done()} />
            : <MdCheckBoxOutlineBlank className='ActionIcon' onClick={() => done()} />}
      </div>
      <div className='ItemAreaSecond'>
        <div className='ItemAreaSecondA'>
          {props.data.name} - {props.data.time} - {props.data.owner}
        </div>
        <div className='ItemAreaSecondB'>
          {drawActions()
            ? <ItemGauge key={props._id} quantity={props.data.sessions.length} />
            : ''}
        </div>
      </div>
      <div className='ItemAreaThird'>
        <MdArrowUpward className='ActionIcon' onClick={() => moveUp()} />
        <MdArrowDownward className='ActionIcon' onClick={() => moveDown()} />
        <MdRemoveCircle className='ActionIconRed' onClick={() => remove()} />
      </div>
    </div>
  )
}
