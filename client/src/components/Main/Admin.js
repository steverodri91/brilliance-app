import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Views/Dashboard/index.js'
import Clients from './Views/Clients/index.js'
import Events from './Views/Events/index.js'
import Invoices from './Views/Invoices/index.js'

export default class Admin extends Component {
  render(){
    const { match, user } = this.props
    return (
      <Switch>
        <Route  exact path={match.path}  render={ props => <Dashboard {...props} user={user} /> } />
        <Route  path={`${match.path}/events`} render={ props => <Events {...props} user={user} /> } />
        <Route  path={`${match.path}/clients`} render={ props => <Clients {...props} user={user} /> } />
        <Route  path={`${match.path}/invoices`} render={ props => <Invoices {...props} user={user} /> } />
      </Switch>
    )
  }
}