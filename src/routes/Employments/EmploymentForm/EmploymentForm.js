import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Select from 'react-select'
import $ from 'jquery'
import moment from 'moment'

import { getAllOccupations } from '../../../store/actions/occupations'
import { createEmployment, getAllEmployments } from '../../../store/actions/employments'

import {
  Card,
  CardBlock,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class EmploymentForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      loadsave: false,
      selectValue: null,
      employment: {
        description: '',
        start_date: this.props.employment ? this.props.employment.start_date : moment().format('YYYY-MM-DD'),
        end_date: this.props.employment ? this.props.employment.end_date : moment().format('YYYY-MM-DD'),
        public: false,
        current:  this.props.employment ? this.props.employment.current : false
      }
    }

    this.props.occupations.length === 0 && dispatch(getAllOccupations())

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleOccupationChange = this._handleOccupationChange.bind(this)
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
        employment: {
          ...this.state.employment,
          [name]: value
        }
      })
    }
  }

  _handleOccupationChange (value) {
    this.setState({
      selectValue: value,
      employment: {
        ...this.state.employment,
        occupation: value.value
      }
    })
  }

  _handleDateChange (startDate, endDate, hasError, current) {
    this.setState({
      employment: {
        ...this.state.employment,
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
    dispatch(createEmployment(this.state.employment)).then(() => {
      dispatch(getAllEmployments())
      document.getElementById('employmentForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  render () {
    let { employment } = this.props
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ny anställning</CardTitle>
        </CardHeader>
        <CardBlock>
          <Form id='employmentForm' onSubmit={(e) => this._handleSubmit(e)}>
            <FormGroup>
              <Label for='employer'>Företag *</Label>
              <Input type='text' name='employer' id='employer' defaultValue={employment ? employment.employer : ''}
                ref={(input) => this.employer = input} onChange={this._handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for='title'>Befattning *</Label>
              <Input type='text' name='title' id='title' defaultValue={employment ? employment.title : ''}
                ref={(input) => this.title = input} onChange={this._handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for='occupation'>Yrkeskategori *</Label>
              <Select
                options={this._getOptions()}
                clearable
                onChange={this._handleOccupationChange}
                placeholder='Välj yrke'
                value={this.state.selectValue}
              />
            </FormGroup>
            <StartEndDate withCurrent onChange={this._handleDateChange} />
            <FormGroup>
              <Label for='description'>Jag bidrar / bidrog med *</Label>
              <Input type='textarea' name='description' id='description' rows='4' defaultValue={employment ? employment.description : ''}
                     ref={(input) => this.description = input} onChange={this._handleInputChange} />
            </FormGroup>
            <ThreeDButton small>Lägg till anställning</ThreeDButton>
          </Form>
        </CardBlock>
      </Card>
    )
  }
}

export default withRouter(connect((state) => state)(EmploymentForm))
