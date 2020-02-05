import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Main from './components/Main/index.js'
import Login from './components/Login/index.js'
import { GOOGLE } from './services/google_service'
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: JSON.parse(localStorage.getItem('user')) ||
        {
          isAuthenticated: false,
          accessLevel: null
        }
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.signout
    }
  }

  async componentDidMount(){
    await this.setAccessLevel()
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  authenticate = async(cb) => {
    await this.setAccessLevel()
    await cb()
  }

  signout = async(cb) => {
    localStorage.clear()
    this.setState({ user: { isAuthenticated: false }}, async() => cb? await cb() : null)
  }

  setAccessLevel = async() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) this.setState({ user })
    else {
      const profile = await GOOGLE.getUser(this.ajaxOptions)

      if (profile) {
        const calendar = await this.fetchAdminCalendar(profile)
        let user = {
          isAuthenticated: true,
          profile
        }

        if (calendar) {
          user.accessLevel = 'admin'
          localStorage.setItem('google_calendar_id', calendar.id)
          localStorage.setItem('user', JSON.stringify(user))

        } else {
          user.accessLevel = 'employee'
        }

        this.setState({ user })
      }
    }
  }

  getGoogleProfile = async() => {
    const profileObj = await GOOGLE.getUser(this.ajaxOptions)
    if (profileObj) return profileObj
  }

  findAdminCalendar = async() => {
    const calendars = await GOOGLE.getCalendars(this.ajaxOptions);
    if (calendars) {
      const jobsCalendar = calendars.find( calendar => {
        return (
          calendar.summary === 'Jobs' &&
          calendar.id.includes('bob@brilliancepro.com')
        )
      })
      if (jobsCalendar) {
        return jobsCalendar
      }
    }
  }

  fetchAdminCalendar = async(user) => {
    let calendar;
    if (user) calendar = await this.findAdminCalendar()
    else {
      const u = await this.getUser()
      if (u) calendar = await this.findAdminCalendar()
    }
    return calendar
  }

  render() {
    const { user: { isAuthenticated, accessLevel }} = this.state
    return (
      <Router>
        <Fragment>
          <Route
            exact
            path="/"
            render={ props => isAuthenticated?
              <Redirect to={`/${accessLevel}`}/>
              :
              <Redirect to="/login"/>
            }
          />
          <Switch>
            <Route path="/login" render={props => <Login {...props} {...this.state} authenticate={this.authenticate}/>}/>
            <Route render={props => <Main {...props} {...this.state} signout={this.signout} getGoogleProfile={this.getGoogleProfile}/>} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
export default App;
