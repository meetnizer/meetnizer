import React, { Component } from 'react'
import { Button } from 'reactstrap'
import NewMeeting from './screens/NewMeeting'
import logo from './img/logomarca_white.png'
import './App.css'
import ShowError from './Util'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: '',
      userData: '',
      openModal: false
    }

    this.handleSetupNewMeeting = this.handleSetupNewMeeting.bind(this)
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

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div class='App-Content'>
          {!(this.state.configured) ? <Button onClick={this.handleSetupNewMeeting}>Create a meeting</Button> : ''}
          {(this.state.configured) ? <Button>Open meeting {this.state.config.dbFiles[0].alias}</Button> : ''}
          <br /><br /><span>Default configuration file location: {this.state.userData}</span>
          {this.state.openModal ? <NewMeeting /> : ''}
        </div>
      </div>
    )
  }
}

export default App
/*
<Button color='danger'>Danger!</Button>
          <button className='marginTop big' onClick={this.handleStart}>
            Start
          </button>
*/
