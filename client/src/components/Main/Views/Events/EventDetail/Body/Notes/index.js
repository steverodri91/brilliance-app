import React from 'react'
import './index.css'

export default function Notes(props){
  const { fields, editMode } = props

  const view = () => {
    if (editMode) {
      return (
        <textarea
          className="Notes"
          type="text"
          name='notes'
          value={fields.notes? fields.notes : ''}
          onChange={props.handleChange}
          tabIndex="9"
        />
      )
    } else {
      return (
        <div className="Notes--readonly">
          {fields.notes? notes(fields.notes) : null}
        </div>
      )
    }
  }

  const notes = (text) => {
    const arr = text.split(`\n`)
    return arr.map((p, id) => (
      <p key={id}>{p}</p>
    ))
  }

  return (
    <div className="EventDetail-Body--component EventDetail-Body--notes">
      <div className="EventDetail-Body--component-title"><h3>Notes</h3></div>
      <div className="Notes--container">
        <label>Notes</label>
        {view()}
      </div>
    </div>
  )
}
