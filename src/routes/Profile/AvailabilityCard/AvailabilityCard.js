import React from 'react'
import { connect } from 'react-redux'
import '../Profile.scss'
import classNames from 'classnames'
import Slider from 'rc-slider'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'

class AvailabilityCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      availability: this.props.profile.availability
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.onAvailabilityChange = this.onAvailabilityChange.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
    this.getAvailabilityString = this.getAvailabilityString.bind(this)
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
    this.props.onOpen()
  }

  onAvailabilityChange (value) {
    this.setState({
      availability: value
    })
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      availability: this.props.profile.availability
    })
    this.props.revertChanges()
  }

  getAvailabilityString () {
    switch (this.state.availability) {
      case 0:
        return 'Omgående'
      case 1:
        return '1 månad'
      case 2:
        return '2 månader'
      case 3:
        return '3 månader'
      case 4:
        return ' över 3 månader'
    }
  }

  render () {
    let { profile } = this.props

    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times cancel-btn' onClick={() => this.revertChanges()} />
          </div>
          <img src='/img/tillganglighet.png' className='img-fluid' />
          <CardBlock>
            <CardTitle className='text-center'>Tillgänglighet</CardTitle>
            <CardSubtitle className='text-center'>{this.getAvailabilityString()}</CardSubtitle>
            {this.state.editMode &&
            <Slider
              min={0}
              max={4}
              value={this.state.availability}
              defaultValue={this.state.availability}
              onChange={this.onAvailabilityChange}
              onAfterChange={this.props.onChange}
            />
            }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(AvailabilityCard)
