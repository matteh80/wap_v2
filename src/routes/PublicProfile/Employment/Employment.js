import React from 'react'
import PropTypes from 'prop-types'

export default class Employment extends React.Component {

  constructor (props) {
    super(props)

    this._getStartEndDate = this._getStartEndDate.bind(this)
  }

  _getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' - Nuvarande'
    } else {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  render () {
    let { employment } = this.props
    return (
      <div className='employmentItem'>
        <small className='date'><span>{this._getStartEndDate(employment.start_date, employment.end_date, employment.current)}</span></small>
        <h5 className='mb-1'>{employment.title}</h5>
        <h6>{employment.employer}</h6>
      </div>
    )
  }
}

Employment.propTypes = {
  employment: PropTypes.object.isRequired
}
