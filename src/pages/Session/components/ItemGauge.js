import React from 'react'
import {
  MdStop
} from 'react-icons/md'

export default function ItemGauge (props) {
  var className = ''
  if (props.quantity > 1) {
    className = 'ActionGaugeOk'
  } else if (props.quantity > 2 && props.quantity <= 4) {
    className = 'ActionGaugeWarning'
  } else if (props.quantity > 4) {
    className = 'ActionGaugeProblem'
  }
  var items = []
  if (props.quantity > 1) {
    for (var i = 0; i < props.quantity; i++) {
      items.push(<MdStop key={i} className={className} />)
    }
  }

  return (
    <div className='ActionGauge'>
      {items}
    </div>
  )
}
