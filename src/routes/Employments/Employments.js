import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'
import EmploymentForm from './EmploymentForm/EmploymentForm'
import { getAllEmployments, createEmployment, updateEmployment, removeEmployment } from '../../store/actions/employments'
import Masonry from 'react-masonry-component'
import _ from 'lodash'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

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
      .catch((error) => {

      })
      .then(() => {
        dispatch(getAllEmployments())
      // document.getElementById('employmentForm').reset()
      })
  }

  removeEmployment (employment) {
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
    let publicCount = _.filter(mEmployments, { 'public': true }).length
    console.log(publicCount)

    return (
      <Container fluid>
        <Row className='flex-row-reverse'>
          <SpeechBubble hideable pos='side' xs='12' sm='12' md='12' xl='3'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas arcu eu ipsum dictum interdum.
              Ut rhoncus enim ante, vitae dictum lacus dignissim id. Curabitur malesuada urna quis dui placerat volutpat.
              Nulla non accumsan ante. Morbi ut mauris congue, aliquet libero eget, tincidunt purus. </p>
            <p>Aliquam volutpat dignissim volutpat. Fusce id nulla justo. Sed cursus mollis magna sed egestas.
              Aenean ac felis ipsum. Praesent sodales pulvinar velit, eu luctus libero posuere nec.</p>
          </SpeechBubble>
          <Col>
            <div className='timeline'>
              <Masonry
                onClick={this.handleClick}
                className='row'
                ref={function (c) {
                  this.masonry = this.masonry || c.masonry
                }.bind(this)}
              >
                <EmploymentForm layout={this.layout} collapse={employments.length === 0} translate={this.props.translate} />
                {mEmployments.length > 0 && mEmployments.map((employment) => {
                  return <EmploymentItem key={employment.id} employment={employment} occupations={this.props.occupations} publicCount={publicCount}
                    onChange={this.updateEmployment} layout={this.layout} onRemove={this.removeEmployment} translate={this.props.translate} />
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
