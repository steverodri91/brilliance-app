import React, { Component } from 'react'
import Datetime from 'react-datetime'
import SearchField from '../../../../../../SearchField/'
import { locationName } from '../../../../../../../helpers/locationName'
import moment from 'moment'
import './react-datetime.css'

export default class Edit extends Component {
  render(){
    const { fields, searchFieldData } = this.props
    return (
      <div className="Logistics">
        <label>Start</label>

          <div className="Edit--Field datetime">
            <Datetime
              className="Input--container"
              inputProps={{ className: "Input", tabIndex: "6" }}
              value={fields.start? moment(fields.start) : ''}
              viewDate={fields.start && fields.start !== ''? moment(fields.start) : moment().startOf('hour')}
              timeConstraints={{ minutes:{ step: 5 } }}
              onChange={(datetime) => this.props.onDateChange('start', datetime)}
              closeOnSelect={false}
              closeOnTab={true}
            />
          </div>

        <label>End</label>

          <div className="Edit--Field datetime">
            <Datetime
              className="Input--container"
              inputProps={{ className:"Input", tabIndex:"7" }}
              value={fields.end? moment(fields.end) : ''}
              viewDate={fields.start? moment(fields.start) : fields.end? moment(fields.end): moment().startOf('hour')}
              viewMode={'time'}
              timeConstraints={{ minutes:{ step: 5 } }}
              isValidDate={(current) => current.isSameOrAfter(moment(fields.start), 'day')}
              onChange={(datetime) => this.props.onDateChange('end', datetime)}
              closeOnSelect={true}
              closeOnTab={true}
            />
          </div>

        <label>Call</label>

          <div className="Edit--Field datetime">
            <Datetime
              className="Input--container"
              inputProps={{ className: "Input", tabIndex: "8"}}
              value={fields.callTime? moment(fields.callTime) : ''}
              viewDate={fields.start? moment(fields.start): fields.callTime? moment(fields.callTime) : moment().startOf('hour')}
              viewMode={'time'}
              timeConstraints={{ minutes:{ step: 5 } }}
              isValidDate={(current) => current.isSameOrBefore(moment(fields.start), 'day')}
              onChange={(datetime) => this.props.onDateChange('call', datetime)}
              closeOnSelect={false}
              closeOnTab={true}
            />
          </div>

        <label>Call Location</label>

          <SearchField
            {...this.props}
            searchResults={searchFieldData && searchFieldData.callLocations}
            formClassName='Edit--Field'
            resultsClassName='Edit--results'
            resultClassName='Edit--result'
            formDataValue={this.props.formData && this.props.formData.call_location_id}
            formatResult={locationName}
            input={{
              className:'Input',
              name: 'callLocation',
              value: fields.callLocation? fields.callLocation : '',
              tabIndex: 9
            }}
            handleChange={this.props.handleSearchChange}
            onEnter={this.props.onEnter}
            onSelect={this.props.onSelect}
          />
      </div>
    )
  }
}
