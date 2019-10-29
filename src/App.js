import React, { Component } from 'react'
import logo from './img/logomarca_white.png'
import './App.css'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer
// const fs = electron.remote.require('fs')

class App extends Component {
  constructor (props) {
    super(props)

    ipcRenderer.on('test.reply', (event, args) => {
      console.log('===>>>', args)
    })
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
        </div>
      </div>
    )
  }
}

export default App
