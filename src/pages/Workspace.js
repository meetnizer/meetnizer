import React, { useState, useEffect } from 'react'
import MeetingList from '../components/MeetingList'
import ShowError from '../UtilView'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const Workspace = (props) => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    ipcRenderer.on('workspace.selected.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      setSelected(args.data.workspaceAlias)
    })

    return () => {
      ipcRenderer.removeAllListeners('workspace.selected.message.reply')
    }
  }, [])

  function handleClick (item) {
    ipcRenderer.send('workspace.selected.message', { workspaceAlias: item })
  }

  return (
    <div>
      <h5>Select your workspace:</h5><br />
      {props.data.dbFiles.map((item, index) => (
        <h6 key={index}>
          <a href='#' onClick={() => handleClick(item.alias)}>{item.alias}</a>
        </h6>
      )
      )}
      <br />
      {selected ? <MeetingList data={props.data} /> : ''}
    </div>
  )
}

export default Workspace
