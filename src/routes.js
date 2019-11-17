import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Start from './pages/Start'
import Workspace from './pages/Workspace'
import Meeting from './pages/Meeting'
import Session from './pages/Session'

export default function Routes () {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Start} />
        <Route path='/start' component={Start} />
        <Route path='/workspace' component={Workspace} />
        <Route path='/meeting/:id/:name' component={Meeting} />
        <Route path='/session/new' component={Session} />
      </Switch>
    </BrowserRouter>
  )
}
