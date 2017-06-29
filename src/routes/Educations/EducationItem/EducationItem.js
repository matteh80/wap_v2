import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import Loader from '../../../components/Misc/Loader/Loader'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText,
  Label
} from 'reactstrap'

import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

let _ = require('lodash')

class EducationItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      education: Object.assign({}, this.props.education),
      loadsave: false
    }

    this._getStartEndDate = this._getStartEndDate.bind(this)
    this._getSchoolTypeName = this._getSchoolTypeName.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleDateChange = this._handleDateChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editMode !== prevState.editMode) {
      this.props.layout()
    }
  }

  componentWillReceiveProps (newProps) {
    if (_.isEqual(this.state.education, newProps.education) && this.state.loadsave) {
      this.setState({
        loadsave: false
      })
    }
  }

  _getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' - Nuvarande anställning'
    } else {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  _getSchoolTypeName (type) {
    switch (type) {
      case 'high_school':
        return 'Gymnasium'
      case 'university':
        return 'Universit/Högskola'
      case 'vocational':
        return 'YH/Yrkesutbildning'
      case 'single_courses':
        return 'Enstaka kurser'
    }
  }

  toggleEditMode () {
    if (this.state.editMode && !_.isEqual(this.state.education, this.props.education)) {
      this.props.onChange(this.state.education)
      this.setState({
        loadsave: true,
        editMode: false,
      })
    } else {
      this.setState({
        loadsave: false,
        editMode: !this.state.editMode,
      })
    }
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      education: this.props.education
    })
  }

  _handleInputChange (e) {
    const target = e.target

    if (target) {
      const value = target.type === 'checkbox' ? target.checked : target.value
      const name = target.name

      if (name === 'current') {
        if (event.target.checked) {

        }
      }

      this.setState({
        education: {
          ...this.state.education,
          [name]: value
        }
      })
    }
  }

  _handleDateChange (startDate, endDate, hasError, current) {
    this.setState({
      education: {
        ...this.state.education,
        start_date: moment(startDate).format('YYYY-MM-DD'),
        end_date: moment(endDate).format('YYYY-MM-DD'),
      }
    })
  }

  render () {
    let { education } = this.props
    let { id, type, school, orientation, start_date, end_date, description } = education
    let wrapperClass = classNames('btn-wrapper hasRemove', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col className='timeline-item'>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date, false)}
        </div>
        <div className='timeline-img' />
        <div className='timeline-content'>
          <Card>
            <Loader active={this.state.loadsave} />
            <div className={wrapperClass}>
              <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
              <i className='fa fa-mail-reply cancel-btn' onClick={() => this.revertChanges()} />
              <i className='fa fa-times remove-btn' onClick={(e) => this.props.onRemove(e, education)} />
            </div>
            {!this.state.editMode &&
            <CardBlock>
              <CardTitle>{orientation}</CardTitle>
              <CardSubtitle>{school} ({this._getSchoolTypeName(type)})</CardSubtitle>
              <CardText>{description}</CardText>
            </CardBlock>
            }
            {this.state.editMode &&
            <CardBlock>
              <AvForm id='educationForm' onSubmit={(e) => this._handleSubmit(e)}>
                <AvGroup>
                  <Label>Typ av skola</Label>
                  <AvField type='select' ref={(select) => { this.type = select }} name='type'
                    defaultValue={education.type} onChange={this._handleInputChange}>
                    <option value='university'>Högskola / Universitet</option>
                    <option value='vocational'>YH / Övrig utbildning</option>
                    <option value='single_courses'>Enstaka kurser</option>
                    <option value='high_school'>Gymnasium</option>
                  </AvField>
                </AvGroup>
                <AvGroup>
                  <Label for='orientation'>Inriktning *</Label>
                  <AvField type='text' name='orientation' id='orientation' defaultValue={education ? education.orientation : ''}
                    ref={(input) => { this.orientation = input }} onChange={this._handleInputChange} />
                </AvGroup>
                <AvGroup>
                  <Label for='school'>Skola *</Label>
                  <AvField type='text' name='school' id='school' defaultValue={education ? education.school : ''}
                    ref={(input) => { this.school = input }} onChange={this._handleInputChange} />
                </AvGroup>
                <StartEndDate foo={this.state.education} onChange={this._handleDateChange} />
                <AvGroup>
                  <Label for='description'>Beskrivning</Label>
                  <AvField type='textarea' name='description' id='description' rows='4' defaultValue={education ? education.description : ''}
                    ref={(input) => { this.description = input }} onChange={this._handleInputChange} />
                </AvGroup>
              </AvForm>
            </CardBlock>
            }
          </Card>
        </div>
      </Col>
    )
  }
}

export default EducationItem
