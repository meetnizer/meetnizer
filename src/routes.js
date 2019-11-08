import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Start from './pages/Start'

export default function Routes () {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Start} />
        <Route path='/start' component={Start} />
      </Switch>
    </BrowserRouter>
  )
}
