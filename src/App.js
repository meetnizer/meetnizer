import React, { Component } from 'react'
import logo from './img/logomarca_white.png'
import './App.css'
// const electron = window.require('electron')
// const fs = electron.remote.require('fs')
// const ipcRenderer = electron.ipcRenderer

class App extends Component {
  /* constructor (props) {
    super(props)
  } */

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
        </div>
        <div>
          <button className='marginTop big'>
            Start
          </button>
        </div>
      </div>
    )
  }
}

export default App
