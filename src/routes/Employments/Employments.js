import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'
import EmploymentForm from './EmploymentForm/EmploymentForm'
import { getAllEmployments, createEmployment, updateEmployment } from '../../store/actions/employments'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Employments extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employments: Object.assign([], this.props.employments.employments)
    }

    let { dispatch } = this.props
    dispatch(getAllEmployments()).then(() => { console.log('hej') })

    this.updateEmployment = this.updateEmployment.bind(this)
  }

  addEmployment (employment) {
    let { dispatch } = this.props
    dispatch(createEmployment(employment)).then(() => {
      dispatch(getAllEmployments())
      document.getElementById('employmentForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  updateEmployment (employment) {
    let { dispatch } = this.props
    dispatch(updateEmployment(employment)).then(() => {
      dispatch(getAllEmployments())
      // document.getElementById('employmentForm').reset()
    }).catch((error) => {
      alert(error)
    })
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
                return <EmploymentItem key={employment.id} employment={employment} occupations={this.props.occupations} onChange={this.updateEmployment} />
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
