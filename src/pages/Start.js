import React, { Component } from 'react'
import { Button } from 'reactstrap'
import NewMeeting from '../modal/NewMeeting'
import logo from '../img/logomarca_white.png'
import '../App.css'
import ShowError from '../Util'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class Start extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: '',
      userData: '',
      openModal: false
    }

    this.handleSetupNewMeeting = this.handleSetupNewMeeting.bind(this)
    this.handleOpenMeeting = this.handleOpenMeeting.bind(this)
  }

  componentDidMount () {
    ipcRenderer.send('setup.configCheck.message')

    ipcRenderer.on('setup.configCheck.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }

      this.setState({
        configured: false,
        userData: args.data.userData
      })

      if (args.data.configured) {
        ipcRenderer.send('setup.config.message')
      }
    })

    ipcRenderer.on('setup.config.message.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }

      this.setState({ configured: true, config: args.data })
    })

    ipcRenderer.on('setup.create.reply', (event, args) => {
      if (args.error) {
        ShowError(args)
        return
      }

      this.setState({ openModal: false, configured: true, config: args.data })
    })
  }

  handleSetupNewMeeting () {
    this.setState({ openModal: true })
  }

  handleOpenMeeting () {
    ipcRenderer.send('meeting.setSelected', { alias: this.state.config.dbFiles[0].alias })
    this.props.history.push(`/meeting/${this.state.config.dbFiles[0].alias}`)
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div className='App-Content'>
          {!(this.state.configured) ? <Button onClick={this.handleSetupNewMeeting}>Create a meeting</Button> : ''}
          {(this.state.configured) ? <Button onClick={this.handleOpenMeeting}>Open meeting {this.state.config.dbFiles[0].alias}</Button> : ''}
          <br /><br /><span>Default configuration file location: {this.state.userData}</span>
          {this.state.openModal ? <NewMeeting /> : ''}
        </div>
      </div>
    )
  }
}

export default Start
