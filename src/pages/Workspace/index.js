import React, { useState, useEffect } from 'react'
import MeetingList from './components/MeetingList'
import ShowError from '../../UtilView'
import BigHeader from '../components/BigHeader'
import { Button } from 'reactstrap'
import NewWorkspace from './components/NewWorkspace'
import '../../Global.css'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const Workspace = (props) => {
  const [selected, setSelected] = useState('')
  const [dbFiles, setDbFiles] = useState([])
  const [workspaceModal, setWorkspaceModal] = useState(false)

  useEffect(() => {
    ipcRenderer.send('setup.configCheck.message')
    ipcRenderer.on('setup.configCheck.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      if (args.data.hasDbFiles) {
        setDbFiles(args.data.config.dbFiles)
      }
    })
    ipcRenderer.on('setup.create.workspace.message.reply', (event, args) => { ShowError(args) })
    ipcRenderer.on('workspace.selected.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }
      setSelected(args.data.workspaceAlias)
    })

    return () => {
      ipcRenderer.removeAllListeners('workspace.selected.message.reply')
      ipcRenderer.removeAllListeners('setup.create.workspace.message.reply')
      ipcRenderer.removeAllListeners('setup.configCheck.message.reply')
    }
  }, [])

  function handleClick (item) {
    ipcRenderer.send('workspace.selected.message', { workspaceAlias: item })
  }

  function hasWorkspace () {
    return dbFiles && dbFiles.length > 0
  }

  function handleNewWorkspace () {
    setWorkspaceModal(!workspaceModal)
  }
  return (
    <div className='App'>
      <BigHeader />
      <br />
      <Button onClick={handleNewWorkspace}>New Workspace</Button>
      <br />
      <br />
      {hasWorkspace() ? <h5>Select your workspace:</h5> : ''}
      <br />
      {dbFiles.map((item, index) => (
        <h6 key={index}>
          <a href='#' onClick={() => handleClick(item.alias)}>{item.alias}</a>
        </h6>
      )
      )}
      <br />
      {selected ? <MeetingList data={props.data} /> : ''}
      {workspaceModal ? <NewWorkspace close={handleNewWorkspace} /> : ''}
    </div>
  )
}

export default Workspace
