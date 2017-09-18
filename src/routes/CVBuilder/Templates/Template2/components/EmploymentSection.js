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
          <Col className='titleWrapper'>
            <h4 className='sectionTitle'>Anställningar</h4>
          </Col>
          <Col className='line' />
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
      <Row className='employmentItem cvItem mb-4'>
        <Col xs={12}>
          <h6 className='title mb-0'>{employment.title} ({employment.employer})</h6>
          <small className='date'>{this.getStartEndDate(employment.start_date, employment.end_date, employment.current)}</small>
          <p className='description'>{employment.description}</p>
        </Col>
      </Row>
    )
  }
}
