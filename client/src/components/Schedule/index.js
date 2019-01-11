import React, { Component } from 'react'
import List from '../List/index.js'
import moment from 'moment'
import './Schedule.css'

import { getGoogleCalendars, getGoogleEvents } from '../../services/google_service'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: []
    }
  }

  async componentDidMount(){
    await this.findUpcomingUserEvents()
  }

  findAllUserEvents = async() => {
    const user = this.props.user
    if (user) {
      const calendars = await getGoogleCalendars();
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        const events = await getGoogleEvents(jobsCalendar.id)
        const userEvents = events.filter(function(event) {
            if (event.attendees) {
              return event.attendees.find(attendee => (attendee.email = user.email))
            }
          }
        )
        return userEvents
      }
    }
  }

  findUpcomingUserEvents = async() => {
    const userEvents = await this.findAllUserEvents();
    if (userEvents) {
      const upcomingEvents = userEvents.filter(function(event){
        const now = moment().format()
        return moment(start(event)).isAfter(now)
      })
      this.setState({userEvents:upcomingEvents})
    }
  }

  render(){
    return (
      <div className="schedule--container">
        <h2 className='schedule--title'>Schedule</h2>
        <List
          type="Schedule"
          items={this.state.userEvents}
        />
      </div>
    )
  }
}

function start(event) {
  if (event) {
    if (event.start) {
      if (event.start.date) {
        return event.start.date
      } else if (event.start.dateTime) {
        return event.start.dateTime
      }
    }
  }
}