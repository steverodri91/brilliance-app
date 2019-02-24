import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faCheckCircle, faTimesCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faCircle)
library.add(faCheckCircle)
library.add(faTimesCircle)
library.add(faQuestionCircle)

export default function Schedule(props){
  const {
    user,
    item,
    type,
    start,
    end,
    timeUntil,
    displayColumn,
    numColumns,
    styleItem
  }
  = props

  return (
    <a href={item.htmlLink} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, type, numColumns)}>

        <div style={displayColumn('time until')}>{item && timeUntil}</div>

        <div style={displayColumn('event')}>
          <h4>{item && item.summary}</h4>
          <p>{item && item.start && moment(start).format('dddd, MMMM Do')}</p>
          <p>{item && item.start && item.end && `${moment(start).format('LT')} - ${moment(end).format('LT')}`}</p>
        </div>

        <p style={displayColumn('notes')} className="List-Item--description">{item && item.description}</p>

        <div
          style={displayColumn('confirmation')}

        >
          {status()}
        </div>

      </div>
    </a>
  )

  function status(){
    const currentUser = item.attendees.find( attendee => attendee.email === user.email)
    switch (currentUser.responseStatus) {
      case 'needsAction':
        return <FontAwesomeIcon icon="circle" size="3x"/>
      case 'accepted':
        return <FontAwesomeIcon color="green" icon="check-circle" size="3x"/>
      case 'tentative':
        return <FontAwesomeIcon color="gold" icon="question-circle" size="3x"/>
      case 'declined':
        return <FontAwesomeIcon color="red" icon="times-circle" size="3x"/>
      default:
    }
  }
}
