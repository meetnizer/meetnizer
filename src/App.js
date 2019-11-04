import React, { Component } from 'react'
import { Button } from 'reactstrap'
import NewMeeting from './screens/NewMeeting'
import logo from './img/logomarca_white.png'
import './App.css'

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
    ipcRenderer.on('setup.configCheck.reply', (event, args) => {
      this.setState({ configured: args.configured, userData: args.userData })
      if (this.state.configured) {
        ipcRenderer.send('setup.config.message')
      }
    })
    ipcRenderer.send('setup.configCheck.message')

    ipcRenderer.on('setup.config.message.reply', (event, args) => {
      this.setState({ config: args })
    })

    ipcRenderer.on('setup.create.reply', (event, args) => {
      console.log('setup.create.reply')
      if (args.config) {
        this.setState({ openModal: false, config: args.config })
      } else {
        console.log('errr', args, event)
      }
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
        <div>
          {!(this.state.configured) ? <Button onClick={this.handleSetupNewMeeting}>Create a meeting</Button> : ''}
          {this.state.config ? <Button>Open meeting {this.state.config.dbFiles[0].alias}</Button> : ''}
          <br /><span>Default configuration file location: {this.state.userData}</span>
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
