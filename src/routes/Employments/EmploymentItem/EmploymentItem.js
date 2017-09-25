import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import $ from 'jquery'
import moment from 'moment'
import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText,
  Label,
} from 'reactstrap'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import Loader from '../../../components/Misc/Loader/Loader'
import EditButtons from '../../../components/buttons/EditButtons'
import { AvForm, AvGroup, AvField, AvInput } from 'availity-reactstrap-validation'

let _ = require('lodash')

class EmploymentItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      employment: Object.assign({}, this.props.employment),
      occupations: [],
      selectValue: this.props.employment.occupation,
      loadsave: false
    }

    this._getStartEndDate = this._getStartEndDate.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleOccupationChange = this._handleOccupationChange.bind(this)
    this._handleDateChange = this._handleDateChange.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this.getOccupationName = this.getOccupationName.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editMode !== prevState.editMode) {
      this.props.layout()
    }
  }

  componentWillReceiveProps (newProps) {
    if (_.isEqual(this.state.employment, newProps.employment) && this.state.loadsave) {
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

  toggleEditMode () {
    if (this.state.editMode && !_.isEqual(this.state.employment, this.props.employment)) {
      $('#mSubmitBtn').click()
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
      employment: this.props.employment
    })
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

    // this.setState({ occupations: optiondata })

    return optiondata
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
        current: current
      }
    })
  }

  getOccupationName () {
    let occupations = this._getOptions()
    let { employment } = this.props
    let name = occupations.filter(function (occupation) {
      return occupation.id === employment.occupation
    })
    return name[0].name
  }

  onRemove () {
    this.props.onRemove(this.state.employment)
  }

  _handleSubmit (event, errors, values) {
    if (errors.length === 0) {
      this.props.onChange(this.state.employment)
      this.setState({
        loadsave: true,
        editMode: false,
      })
    }
  }

  render () {
    let { employment } = this.state
    let { id, title, employer, occupation, start_date, end_date, description, current } = this.props.employment
    let timelineClass = classNames(
      'timeline-item',
      employment.public && 'isOnWap'
    )

    return (
      <Col className={timelineClass}>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date, current)}
        </div>
        <div className='timeline-img' />
        <div className='timeline-content'>
          <Card>
            <Loader active={this.state.loadsave} />
            <EditButtons hasRemove editMode={this.state.editMode} toggleEditMode={this.toggleEditMode} revertChanges={this.revertChanges} onRemove={this.onRemove} translate={this.props.translate} id={employment.id} />
            {!this.state.editMode &&
              <CardBlock>
                <CardTitle>{title}</CardTitle>
                <CardSubtitle>{employer}</CardSubtitle>
                <CardText>{description}</CardText>
                <CardText className='occupationText'>{this.getOccupationName()}</CardText>
              </CardBlock>
          }
            {this.state.editMode &&
              <CardBlock>
                <AvForm id='employmentForm' model={this.state.employment} style={{ marginTop: 40 }} onSubmit={this._handleSubmit}>
                  <AvGroup>
                    <Label for='employer'>Företag *</Label>
                    <AvField type='text' name='employer' onChange={this._handleInputChange} required />
                  </AvGroup>
                  <AvGroup>
                    <Label for='title'>Befattning *</Label>
                    <AvField type='text' name='title' onChange={this._handleInputChange} required />
                  </AvGroup>
                  <AvGroup>
                    <Label for='occupation'>Yrkeskategori *</Label>
                    <Select
                      options={this._getOptions()}
                      clearable={false}
                      onChange={this._handleOccupationChange}
                      placeholder='Välj yrke'
                      value={this.state.selectValue}
                />
                  </AvGroup>
                  <StartEndDate withCurrent foo={this.state.employment} onChange={this._handleDateChange} />
                  <AvGroup>
                    <Label for='description'>Jag bidrar / bidrog med *</Label>
                    <AvField type='textarea' name='description' rows='4' onChange={this._handleInputChange} maxLength='500' minLength='2' required />
                  </AvGroup>
                  <AvGroup>
                    <Label check inline for='public'>
                      <AvInput type='checkbox' name='public' trueValue="Yes, I'm in!" falseValue='NOPE!'
                        defaultChecked={this.state.employment.public} onChange={this._handleInputChange}
                        disabled={!employment.public && this.props.publicCount === 2} /> Visa på wap card (max två)
                  </Label>
                  </AvGroup>
                  <button type='submit' id='mSubmitBtn' hidden />
                </AvForm>
              </CardBlock>
          }
          </Card>
        </div>
      </Col>
    )
  }
}

export default EmploymentItem
