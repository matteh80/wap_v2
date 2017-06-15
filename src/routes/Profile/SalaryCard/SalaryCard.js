import React from 'react'
import { connect } from 'react-redux'
import '../Profile.scss'
import classNames from 'classnames'
import Slider, { Range } from 'rc-slider';

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'

class SalaryCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render () {
    let { profile } = this.props

    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
          <img src='/img/cash.jpg' className='img-fluid' />
          {!this.state.editMode &&
          <CardBlock>
            <CardTitle className='text-center'>Lön</CardTitle>
            <CardSubtitle className='text-center'>{profile.salary_expectations_min} - {profile.salary_expectations_max}</CardSubtitle>
          </CardBlock>
          }

          {this.state.editMode &&
          <CardBlock>
            <Range />
          </CardBlock>
          }
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(SalaryCard)
