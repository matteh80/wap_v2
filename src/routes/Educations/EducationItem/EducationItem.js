import React from 'react'
import {
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText
} from 'reactstrap'

class EducationItem extends React.Component {
  constructor (props) {
    super(props)

    this._getStartEndDate = this._getStartEndDate.bind(this)
    this._getSchoolTypeName = this._getSchoolTypeName.bind(this)
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

  render () {
    let { id, type, school, orientation, start_date, end_date, description } = this.props.education
    return (
      <div className='timeline-item'>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date, false)}
        </div>
        <div className='timeline-img'>
        </div>
        <Card className='timeline-content'>
          <CardBlock>
            <CardTitle>{orientation}</CardTitle>
            <CardSubtitle>{school} ({this._getSchoolTypeName(type)})</CardSubtitle>
            <CardText>{description}</CardText>
          </CardBlock>
        </Card>
      </div>
    )
  }
}

export default EducationItem
