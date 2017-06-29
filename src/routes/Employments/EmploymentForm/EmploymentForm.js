import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Select from 'react-select'
import $ from 'jquery'
import moment from 'moment'
import classNames from 'classnames'

import { getAllOccupations } from '../../../store/actions/occupations'
import { createEmployment, getAllEmployments } from '../../../store/actions/employments'

import {
  Collapse,
  Card,
  CardBlock,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

let defaultValue
class EmploymentForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    let { occupations } = this.props.occupations
    let categoryitem = occupations[0]
    let item = occupations[0].occupations[0]

    let occupationDefault = {
      label: item.name + ' (' + categoryitem.name + ')',
      value: item.id,
      name: item.name,
      id: item.id,
      parent_name: categoryitem.name,
    }

    this.state = {
      collapse: false,
      loadsave: false,
      selectValue: occupationDefault,
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
    let { occupations, userOccupations } = this.props.occupations
    let optiondata = []
    let index = -1

    $.each(occupations, function (i, categoryitem) {
      $.each(categoryitem.occupations, function (x, item) {
        optiondata.push({
          label: item.name + ' (' + categoryitem.name + ')',
          value: item.id,
          name: item.name,
          id: item.id,
          parent_name: categoryitem.name,
        })
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

  _handleSubmit (e, errors, values) {
    this.setState({ errors, values })

    if (errors.length === 0) {
      let { dispatch } = this.props
      dispatch(createEmployment(this.state.employment)).then(() => {
        dispatch(getAllEmployments())
        document.getElementById('employmentForm').reset()
      })
    }
  }

  toggleCollapse () {
    this.setState({
      collapse: !this.state.collapse
    })
  }

  render () {
    let { employment } = this.props
    let chevronClass = classNames('fa pull-right', this.state.collapse ? 'fa-chevron-down' : 'fa-chevron-up')

    return (
      <Card>
        <CardHeader className='add-items' onClick={() => this.toggleCollapse()}>
          <CardTitle className='pull-left'>Ny anställning</CardTitle>
          <i className={chevronClass} style={{ fontSize: 20 }} />
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBlock>
            <AvForm id='employmentForm' onSubmit={this._handleSubmit}>
              <AvGroup>
                <Label for='employer'>Företag *</Label>
                <AvField type='text' name='employer' id='employer' defaultValue={employment ? employment.employer : ''}
                  ref={(input) => { this.employer = input }} onChange={this._handleInputChange} required />
              </AvGroup>
              <AvGroup>
                <Label for='title'>Befattning *</Label>
                <AvField type='text' name='title' id='title' defaultValue={employment ? employment.title : ''}
                  ref={(input) => { this.title = input }} onChange={this._handleInputChange} required />
              </AvGroup>
              <FormGroup>
                <Label for='occupation'>Yrkeskategori *</Label>
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this._handleOccupationChange}
                  placeholder='Välj yrke'
                  value={this.state.selectValue}
                  required
                />
              </FormGroup>
              <StartEndDate withCurrent onChange={this._handleDateChange} />
              <FormGroup>
                <Label for='description'>Jag bidrar / bidrog med</Label>
                <Input type='textarea' name='description' id='description' rows='4' defaultValue={employment ? employment.description : ''}
                  ref={(input) => { this.description = input }} onChange={this._handleInputChange} />
              </FormGroup>
              <ThreeDButton small>Lägg till anställning</ThreeDButton>
            </AvForm>
          </CardBlock>
        </Collapse>
      </Card>
    )
  }
}

export default withRouter(connect((state) => state)(EmploymentForm))
