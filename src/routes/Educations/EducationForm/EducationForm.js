import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

import { createEducation, getAllEducations } from '../../../store/actions/educations'

import {
  Card,
  CardBlock,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  InputGroup,
  Label,
  Input
} from 'reactstrap'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class EducationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
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

  _handleSubmit (e) {
    e.preventDefault()

    let { dispatch } = this.props
    dispatch(createEducation(this.state.education)).then(() => {
      dispatch(getAllEducations())
      document.getElementById('educationForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  render () {
    let { education } = this.props
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ny utbildning</CardTitle>
        </CardHeader>
        <CardBlock>
          <Form id='educationForm' onSubmit={(e) => this._handleSubmit(e)}>
            <FormGroup>
              <Label>Typ av skola</Label>
              <Input type='select' ref={(select) => this.type = select} name='type'
                defaultValue={this.props.foo && this.props.education.type} onChange={this._handleInputChange}>
                <option value='university'>Högskola / Universitet</option>
                <option value='vocational'>YH / Övrig utbildning</option>
                <option value='single_courses'>Enstaka kurser</option>
                <option value='high_school'>Gymnasium</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for='orientation'>Inriktning *</Label>
              <Input type='text' name='orientation' id='orientation' defaultValue={education ? education.orientation : ''}
                ref={(input) => this.orientation = input} onChange={this._handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for='school'>Skola *</Label>
              <Input type='text' name='school' id='school' defaultValue={education ? education.school : ''}
                ref={(input) => this.school = input} onChange={this._handleInputChange} />
            </FormGroup>
            <StartEndDate onChange={this._handleDateChange} />
            <FormGroup>
              <Label for='description'>Beskrivning</Label>
              <Input type='textarea' name='description' id='description' rows='4' defaultValue={education ? education.description : ''}
                ref={(input) => this.description = input} onChange={this._handleInputChange} />
            </FormGroup>
            <ThreeDButton small>Lägg till utbildning</ThreeDButton>
          </Form>
        </CardBlock>
      </Card>
    )
  }
}

export default withRouter(connect((state) => state)(EducationForm))
