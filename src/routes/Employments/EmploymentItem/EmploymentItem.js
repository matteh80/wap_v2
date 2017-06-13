import React from 'react'
import {
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText
} from 'reactstrap'

class EmploymentItem extends React.Component {
  constructor (props) {
    super(props)

    this._getStartEndDate = this._getStartEndDate.bind(this)
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
    let { id, title, employer, occupation, start_date, end_date, description, current } = this.props.employment;
    return (
      <div className='timeline-item'>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date, current)}
        </div>
        <div className='timeline-img'>
        </div>
        <Card className='timeline-content'>
          <CardBlock>
            <CardTitle>{title}</CardTitle>
            <CardSubtitle>{employer}</CardSubtitle>
            <CardText>{description}</CardText>
          </CardBlock>
        </Card>
      </div>
    )
  }
}

export default EmploymentItem
