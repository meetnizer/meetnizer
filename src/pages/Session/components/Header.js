import React, { useEffect } from 'react'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default function Header (props) {
  // const [sessionRunning, setSessionRunning] = useState(false)
  useEffect(() => {
    ipcRenderer.on('session.start.message.reply', (event, args) => {
      // setSessionRunning(args.start)
    })
    // returned function will be called on component unmount
    return () => {
      ipcRenderer.removeAllListeners('session.start.message.reply')
    }
  }, [])

  function SumMinutes () {
    var total = 0

    for (var i = 0; i < props.items.length; i++) {
      total += Number(props.items[i].time)
    }
    return total
  }
  return (
    <div className='SessionHeader'>
      <div>
        Number of itens: {props.items.length}  ||
        Total of minutes: {SumMinutes()}
      </div>
      <div>
        Session max duration(minutes): {props.sessionDuration}  ||
        Minutes remaining: {props.sessionDuration - SumMinutes()}
      </div>
    </div>
  )
}
