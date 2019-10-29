import React, { Component } from 'react'
import logo from './img/logomarca_white.png'
import './App.css'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer
// const fs = electron.remote.require('fs')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configured: 'n/a'
    }
  }

  componentDidMount () {
    ipcRenderer.on('test.reply', (event, args) => {
      this.testReply(args)
    })
  }

  testReply (args) {
    console.log(args)
    this.setState({ configured: args.configured ? 'yes' : 'nooo' })
  }

  handleStart () {
    ipcRenderer.send('test.message', 'meu valor', 123)
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div>
          <button className='marginTop big' onClick={this.handleStart}>
            Start
          </button>
          <h3>{this.state.configured}</h3>
        </div>
      </div>
    )
  }
}

export default App
