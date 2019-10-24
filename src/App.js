import React, { Component } from 'react'
import logo from './img/logomarca_white.png'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.exampleInvoke = this.exampleInvoke.bind(this)
  }

  exampleInvoke () {
    this.setState({ response: 'Just example change' })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>A simplified way to organize your meetings</h2>
          <p>{this.state.response}</p>
        </div>
        <div>
          <button className='marginTop big' onClick={this.exampleInvoke}>
            Começar
          </button>
        </div>
      </div>
    )
  }
}

export default App
