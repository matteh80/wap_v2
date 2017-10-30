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
            <h2 className='sectionTitle font-italic'>Anställningar</h2>
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
      return moment(startDate).format('YYYY') + ' -'
    } else {
      return moment(startDate).format('YYYY') + ' - ' + moment(endDate).format('YYYY')
    }
  }

  render () {
    let { employment } = this.props
    return (
      <Row className='employmentItem cvItem mb-4'>
        <Col xs={12}>
          <h6 className='title'><strong>{employment.title}</strong> | {employment.employer} <span style={{ fontWeight: 100, color: '#878787' }}>{this.getStartEndDate(employment.start_date, employment.end_date, employment.current)}</span> </h6>
          <p className='description'>{employment.description}</p>
        </Col>
      </Row>
    )
  }
}
