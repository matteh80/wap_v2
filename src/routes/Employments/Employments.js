import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Employments extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { employments } = this.props.employments
    return (
      <Container fluid>
        <Row>
          <Col xs={12} lg={8}>
            <div className='timeline'>
              {employments && employments.map((employment) => {
                return <EmploymentItem key={employment.id} employment={employment} />
              })}
            </div>
          </Col>
          <Col>

          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Employments)
