import React from 'react'
import { connect } from 'react-redux'
import EducationItem from './EducationItem/EducationItem'
import EducationForm from './EducationForm/EducationForm'
import { getAllEducations, createEducation, updateEducation, removeEducation } from '../../store/actions/educations'
import Masonry from 'react-masonry-component'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Educations extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      educations: Object.assign([], this.props.educations.educations)
    }

    let { dispatch } = this.props
    dispatch(getAllEducations())

    this.layout = this.layout.bind(this)
    this.updateEducation = this.updateEducation.bind(this)
    this.removeEducation = this.removeEducation.bind(this)
  }

  addEducation (education) {
    let { dispatch } = this.props
    dispatch(createEducation(education)).then(() => {
      dispatch(getAllEducations())
      document.getElementById('educationForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  updateEducation (education) {
    let { dispatch } = this.props
    dispatch(updateEducation(education))
      .then(() => {
        dispatch(getAllEducations())
        // document.getElementById('educationForm').reset()
      }).catch((error) => {
        alert(error)
      })
  }

  removeEducation (e, education) {
    console.log(e.target)
    let { dispatch } = this.props
    // this.masonry.remove($(e.target).closest('.timeline-item')).masonry('layout')
    dispatch(removeEducation(education))
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { educations } = this.props.educations
    let mEducations = Object.assign([], educations).reverse()

    return (
      <Container fluid>
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
                <EducationForm layout={this.layout} collapse={educations && educations.length === 0} translate={this.props.translate} />
                {mEducations && mEducations.map((education) => {
                  return <EducationItem key={education.id} education={education} layout={this.layout}
                    onChange={this.updateEducation} onRemove={this.removeEducation} />
                })}
              </Masonry>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Educations)
