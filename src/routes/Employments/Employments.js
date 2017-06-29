import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'
import EmploymentForm from './EmploymentForm/EmploymentForm'
import { getAllEmployments, createEmployment, updateEmployment, removeEmployment } from '../../store/actions/employments'
import Masonry from 'react-masonry-component'

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
    dispatch(getAllEmployments())

    this.updateEmployment = this.updateEmployment.bind(this)
    this.removeEmployment = this.removeEmployment.bind(this)
    this.layout = this.layout.bind(this)
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
    dispatch(updateEmployment(employment))
      .then(() => {
      dispatch(getAllEmployments())
      // document.getElementById('employmentForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  removeEmployment (e, employment) {
    console.log(e.target)
    let { dispatch } = this.props
    // this.masonry.remove($(e.target).closest('.timeline-item')).masonry('layout')
    dispatch(removeEmployment(employment))
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { employments } = this.props.employments
    let mEmployments = Object.assign([], employments).reverse()

    return (
      <Container fluid>
        <Row>
          <Col xs={12} sm={12} md={6} xl={5}>
            <EmploymentForm />
          </Col>
        </Row>
        <Row>
          <Col lg={10}>
            <div className='timeline'>
              <Masonry
                onClick={this.handleClick}
                className='row'
                ref={function (c) {
                  this.masonry = this.masonry || c.masonry
                }.bind(this)}
              >
                {mEmployments && mEmployments.map((employment) => {
                  return <EmploymentItem key={employment.id} employment={employment} occupations={this.props.occupations}
                    onChange={this.updateEmployment} layout={this.layout} onRemove={this.removeEmployment} />
                })}
              </Masonry>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Employments)
