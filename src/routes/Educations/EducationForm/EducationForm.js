import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import classNames from 'classnames'

import { createEducation, getAllEducations } from '../../../store/actions/educations'

import {
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Collapse
} from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class EducationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      collapse: this.props.collapse,
      loadsave: false,
      selectValue: null,
      education: {
        description: '',
        start_date: this.props.education ? this.props.education.start_date : moment().format('YYYY-MM-DD'),
        end_date: this.props.education ? this.props.education.end_date : moment().format('YYYY-MM-DD'),
        public: false,
        type:  this.props.education ? this.props.education.type : 'university'
      }
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleDateChange = this._handleDateChange.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _getOptions () {
    let { occupations, useroccupations } = this.props.occupations
    let optiondata = []
    let index = -1

    $.each(occupations, function (i, categoryitem) {
      $.each(categoryitem.occupations, function (x, item) {
        index = $.inArray(item.id, useroccupations)
        if (index === -1) {
          optiondata.push({
            label: item.name + ' (' + categoryitem.name + ')',
            value: item.id,
            name: item.name,
            id: item.id,
            parent_name: categoryitem.name,
          })
        }
      })
    })

    optiondata.sort(function (a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  _handleInputChange (event) {
    const target = event.target

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
        hasError: hasError,
        current: current
      }
    })
  }

  _handleSubmit (e, errors, values) {
    this.setState({ errors, values })
    if (errors.length === 0) {
      let { dispatch } = this.props
      dispatch(createEducation(this.state.education)).then(() => {
        dispatch(getAllEducations())
        this.setState({ collapse: false })
      })
    }
  }

  toggleCollapse () {
    let _self = this
    this.setState({
      collapse: !this.state.collapse,
    })
    $('.fakeTimelineItem').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
      function () {
        _self.props.layout()
      }
    )
  }

  // TODO: Reset form after submit

  render () {
    let { translate } = this.props
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let timelineClass = classNames('timeline-item fakeTimelineItem', this.state.collapse && 'fullOpacity')

    return (
      <Col className={timelineClass}>
        <div className='timeline-fulldate'>{translate('educations.add_education')}</div>
        <div className='timeline-img' />
        <div className='timeline-content'>
          <Card className='fakeItem'>
            <div className='btn-wrapper'>
              <UncontrolledTooltip placement='left' target='add-btn'>
            Lägg till ny utbildning
          </UncontrolledTooltip>
              <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
            </div>
            <CardBlock>
              {!this.state.collapse ? <div className='fakeTitle' /> : <CardTitle>{translate('educations.add_education')}</CardTitle>}
              {!this.state.collapse && <div className='fakeSubtitle' />}
              {!this.state.collapse && <div className='fakeSubtitle w-100 mt-0' />}
              <Collapse isOpen={this.state.collapse}>
                {this.state.collapse &&
                <AvForm id='educationForm' onSubmit={this._handleSubmit}>
                  <AvGroup>
                    <Label>Typ av skola</Label>
                    <AvField type='select' name='type'
                      onChange={this._handleInputChange}>
                      <option value='university'>Högskola / Universitet</option>
                      <option value='vocational'>YH / Övrig utbildning</option>
                      <option value='single_courses'>Enstaka kurser</option>
                      <option value='high_school'>Gymnasium</option>
                    </AvField>
                  </AvGroup>
                  <AvGroup>
                    <Label for='orientation'>Inriktning *</Label>
                    <AvField type='text' name='orientation' id='orientation'
                      ref={(input) => this.orientation = input} onChange={this._handleInputChange} required />
                  </AvGroup>
                  <AvGroup>
                    <Label for='school'>Skola *</Label>
                    <AvField type='text' name='school' id='school'
                      ref={(input) => this.school = input} onChange={this._handleInputChange} required />
                  </AvGroup>
                  <StartEndDate onChange={this._handleDateChange} />
                  <AvGroup>
                    <Label for='description'>Beskrivning</Label>
                    <AvField type='textarea' name='description' id='description' rows='4' maxLength='500'
                      ref={(input) => this.description = input} onChange={this._handleInputChange} />
                  </AvGroup>
                  <ThreeDButton small>Lägg till</ThreeDButton>
                </AvForm>
                }
              </Collapse>
            </CardBlock>
          </Card>
        </div>
      </Col>
    )
  }
}

export default withRouter(connect((state) => state)(EducationForm))
