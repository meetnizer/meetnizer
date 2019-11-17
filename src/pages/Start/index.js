import React, { Component } from 'react'
import { Button } from 'reactstrap'
import Welcome from './components/Welcome'
import BigHeader from '../components/BigHeader'
import './App.css'
import ShowError from '../../UtilView'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class Start extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: false,
      userData: '',
      openWorkspaceModal: false
    }

    this.handleStartConfiguration = this.handleStartConfiguration.bind(this)
    this.checkRedirect = this.checkRedirect.bind(this)
  }

  componentDidMount () {
    ipcRenderer.send('setup.configCheck.message')
    ipcRenderer.on('setup.configCheck.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }

      this.receiveConfigMessage(args)
    })
  }

  componentWillUnmount () {
    ipcRenderer.removeAllListeners('setup.configCheck.message')
    ipcRenderer.removeAllListeners('setup.configCheck.message.reply')
  }

  receiveConfigMessage (args) {
    if (args.err) {
      ShowError(args)
      return
    }
    this.setState(
      { configured: args.data.configured, config: args.data.config, hasDbFiles: args.data.hasDbFiles },
      () => { this.checkRedirect() }
    )
  }

  checkRedirect () {
    if (!this.isNeverConfigured()) {
      this.handleStartConfiguration()
    }
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
    this.props.history.push('/workspace')
  }

  render () {
    return (
      <div className='App'>
        <BigHeader />
        <div className='App-Content'>
          {this.isNeverConfigured() ? <Welcome /> : ''}
          {this.isNeverConfigured() ? <Button onClick={this.handleStartConfiguration}>Start configuration</Button> : ''}
        </div>
      </div>
    )
  }
}

export default Start
