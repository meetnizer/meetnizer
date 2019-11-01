import React, { Component } from 'react'
// import { Button } from 'reactstrap'
import logo from './img/logomarca_white.png'
import './App.css'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: '',
      userData: ''
    }
  }

  componentDidMount () {
    ipcRenderer.on('checkConfiguration.reply', (event, args) => {
      this.configCheck(args)
    })
    ipcRenderer.send('checkConfiguration.message')
  }

  configCheck (args) {
    this.setState({ configured: args.configured, userData: args.userData })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div>
          <h3>{this.state.configured}{this.state.userData}</h3>
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
