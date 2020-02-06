import React from 'react'

export default function Header (props) {
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
        Session duration in minutes: {props.sessionDuration}  ||
        Real time: {props.sessionDuration - SumMinutes()}
      </div>
    </div>
  )
}
