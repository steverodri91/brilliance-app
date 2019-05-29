import React, { Component } from 'react'
import Edit from './Edit'
import View from './View'
import { styleWorkerStatus } from '../../../../../../../helpers/eventHelpers'
import './index.css'

export default class Staff extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  iconSize = () => {
    const { mobile } = this.props
    if (mobile) {
      return '2x'
    } else {
      return '2x'
    }
  }

  view = () => {
    const { mobile, editMode, workers } = this.props
    if (editMode) {
      return (
        <Edit
          {...this.props}
          iconSize={this.iconSize()}
          status={styleWorkerStatus}
        />
      )
    } else if (workers && workers.length) {
      return (
        <View
          {...this.props}
          iconSize={this.iconSize()}
          status={styleWorkerStatus}
        />
      )
    } else {
      return (
        <div className="Staff--container">
          {mobile? <label>Staff</label> : null }
          <div className="Staff--none">
            <p>No one has been scheduled</p>
            <p>to work this event...</p>
          </div>
        </div>
      )
    }
  }

  render(){
    const { styleComp } = this.props
    return (
      <div style={styleComp('Staff')}className="EventDetail-Body--component EventDetail-Body--staff">
        <div className="EventDetail-Body--component-title"><h4>Staff</h4></div>
          {this.view()}
      </div>
    )
  }
}
