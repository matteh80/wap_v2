import React from 'react'

import {
  Row,
  Col,
} from 'reactstrap'

export default class EmploymentSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (newProps) {

  }

  componentDidMount () {
    // //console.log('employment height: '+ $('#employments').outerHeight())
    // this.props.onRef(this)
  }

  render () {
    let { employments } = this.props
    return (
      <section className='cvSection' id='employments'>
        <Row>
          <Col xs={12}>
            <h5 className='sectionTitle'>Anställningar</h5>
          </Col>
        </Row>
        {employments && employments.map((employment) => {
          return <CVEmploymentItem key={employment.id} employment={employment} />
        })}
      </section>
    )
  }
}

class CVEmploymentItem extends React.Component {
  constructor (props) {
    super(props)

    this.getStartEndDate = this.getStartEndDate.bind(this)
  }

  getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' -'
    } else {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  render () {
    let { employment } = this.props
    return (
      <Row className='employmentItem cvItem'>
        <Col xs={12} className='leftColumn'>
          <h6 className='l_title'>{employment.title} ({employment.employer})</h6>
          <small className='date'>{this.getStartEndDate(employment.start_date, employment.end_date, employment.current)}</small>
          <p className='description'>{employment.description}</p>
        </Col>
      </Row>
    )
  }
}
