import React from 'react'

import {
  Row,
  Col,
} from 'reactstrap'

export default class EducationSection extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { educations } = this.props
    return (
      <section className='cvSection' id='educations'>
        <Row>
          <Col className='titleWrapper'>
            {educations && educations.length > 0 && <h2 className='sectionTitle font-italic'>Utbildningar</h2>}
          </Col>
        </Row>
        {educations && educations.map((education) => {
          return <CVEducationItem key={education.id} education={education} />
        })}
      </section>
    )
  }
}

class CVEducationItem extends React.Component {
  constructor (props) {
    super(props)

    this.getStartEndDate = this.getStartEndDate.bind(this)
  }

  getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('YYYY') + ' - '
    } else {
      return moment(startDate).format('YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  render () {
    let { education } = this.props

    let educationTypeString
    if (this.props.education.type === 'university') {
      educationTypeString = (<span>Universitet</span>)
    } else if (this.props.education.type === 'high_school') {
      educationTypeString = (<span>Gymnasium</span>)
    } else if (this.props.education.type === 'vocational') {
      educationTypeString = (<span>Yrkesutbildning</span>)
    } else {
      educationTypeString = (<span>Enstaka kurser</span>)
    }

    return (
      <Row className='educationItem cvItem mb-4'>
        <Col xs={12}>
          <h6 className='title'><strong>{education.orientation}</strong> | {education.school} <span style={{ fontWeight: 100, color: '#878787' }}>{this.getStartEndDate(education.start_date, education.end_date, false)}</span></h6>
          <p className='description'>{education.description}</p>
        </Col>
      </Row>
    )
  }
}
