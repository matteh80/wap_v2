import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'
import EmploymentForm from './EmploymentForm/EmploymentForm'
import { getAllEmployments } from '../../store/actions/employments'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Employments extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    dispatch(getAllEmployments())
  }

  render () {
    let { employments } = this.props.employments
    let mEmployments = Object.assign([], employments).reverse()

    return (
      <Container fluid>
        <Row>
          <Col xs={12} lg={8}>
            <div className='timeline'>
              {mEmployments && mEmployments.map((employment) => {
                return <EmploymentItem key={employment.id} employment={employment} />
              })}
            </div>
          </Col>
          <Col>
            <EmploymentForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Employments)
