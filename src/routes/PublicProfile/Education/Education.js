import React from 'react'
import PropTypes from 'prop-types'

export default class Education extends React.Component {

  constructor (props) {
    super(props)

    this._getStartEndDate = this._getStartEndDate.bind(this)
    this._getSchoolTypeName = this._getSchoolTypeName.bind(this)
  }

  _getSchoolTypeName (type) {
    switch (type) {
      case 'high_school':
        return 'Gymnasium'
      case 'university':
        return 'Universit/Högskola'
      case 'vocational':
        return 'YH/Yrkesutbildning'
      case 'single_courses':
        return 'Enstaka kurser'
    }
  }

  _getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' - Nuvarande anställning'
    } else {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  render () {
    let { education } = this.props
    return (
      <div className='educationItem'>
        <small className='date'><span>{this._getStartEndDate(education.start_date, education.end_date, education.current)}</span></small>
        <h5 className='mb-1'>{education.orientation}</h5>
        <h6>{education.school}</h6>
      </div>
    )
  }
}

Education.propTypes = {
  education: PropTypes.object.isRequired
}
