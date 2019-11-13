import React, { Component } from 'react'
import { Button } from 'reactstrap'
import NewWorkspace from '../modal/NewWorkspace'
import Welcome from '../components/Welcome'
import logo from '../img/logomarca_white.png'
import '../App.css'
import ShowError from '../UtilView'
import Workspace from './Workspace'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class Start extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: '',
      userData: '',
      openWorkspaceModal: false
    }

    this.handleStartConfiguration = this.handleStartConfiguration.bind(this)
  }

  componentDidMount () {
    ipcRenderer.send('setup.configCheck.message')
    ipcRenderer.on('setup.configCheck.message.reply', (event, args) => { this.receiveConfigMessage(args) })
    ipcRenderer.on('setup.create.workspace.message.reply', (event, args) => { ShowError(args) })
  }

  componentWillUnmount () {
    ipcRenderer.removeAllListeners('setup.configCheck.message')
    ipcRenderer.removeAllListeners('setup.create.workspace.message.reply')
    ipcRenderer.removeAllListeners('setup.configCheck.message.reply')
  }

  receiveConfigMessage (args) {
    if (args.err) {
      ShowError(args)
      return
    }
    console.log('a', args.data)
    this.setState({ configured: args.data.configured, config: args.data.config, hasDbFiles: args.data.hasDbFiles })
  }

  isNeverConfigured () {
    if (this.state.configured) {
      if (this.state.hasDbFiles) {
        return false
      }
    }
    return true
  }

  handleStartConfiguration () {
    this.setState({ openWorkspaceModal: true })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div className='App-Content'>
          {this.isNeverConfigured() ? <Welcome /> : ''}
          {this.isNeverConfigured() ? <Button onClick={this.handleStartConfiguration}>Start configuration</Button> : ''}
          {!this.isNeverConfigured() ? <Workspace data={this.state.config} /> : ''}
        </div>
        {this.state.openWorkspaceModal ? <NewWorkspace /> : ''}
      </div>
    )
  }
}

export default Start
