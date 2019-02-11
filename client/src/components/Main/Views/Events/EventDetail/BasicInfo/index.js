import React, { Component } from 'react'
import Header from './Header'
import MainInfo from './MainInfo/index.js'
import Notes from './Notes/index.js'
import Staff from './Staff/index.js'
import './index.css'

export default class BasicInfo extends Component {
  render(){
    return (
      <div className="BasicInfo--container">

        <Header {...this.props} />

        <MainInfo {...this.props} />

        <div className="BasicInfo--staff-and-notes">

          <Notes {...this.props} />

          <Staff {...this.props} />

        </div>

      </div>
    )
  }
}