import React from 'react'
import { connect } from 'react-redux'
import EducationItem from './EducationItem/EducationItem'
import EducationForm from './EducationForm/EducationForm'
import { getAllEducations } from '../../store/actions/educations'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Educations extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    dispatch(getAllEducations())
  }

  render () {
    let { educations } = this.props.educations
    let mEducations = Object.assign([], educations).reverse()

    return (
      <Container fluid>
        <Row>
          <Col xs={12} lg={8}>
            <div className='timeline'>
              {mEducations && mEducations.map((education) => {
                return <EducationItem key={education.id} education={education} />
              })}
            </div>
          </Col>
          <Col>
            <EducationForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Educations)
