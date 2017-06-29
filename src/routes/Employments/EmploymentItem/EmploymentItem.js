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
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import StartEndDate from '../../../components/Misc/StartEndDate/StartEndDate'
import Loader from '../../../components/Misc/Loader/Loader'

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
      this.props.onChange(this.state.employment)
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
        hasError: hasError,
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

  render () {
    let { employment } = this.state
    let { id, title, employer, occupation, start_date, end_date, description, current } = this.props.employment
    let wrapperClass = classNames('btn-wrapper hasRemove', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col className='timeline-item'>
        <div className='timeline-fulldate'>
          {this._getStartEndDate(start_date, end_date, current)}
        </div>
        <div className='timeline-img' />
        <div className='timeline-content'>
          <Card>
            <Loader active={this.state.loadsave} />
            <div className={wrapperClass}>
              <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
              <i className='fa fa-mail-reply cancel-btn' onClick={() => this.revertChanges()} />
              <i className='fa fa-times remove-btn' onClick={(e) => this.props.onRemove(e, employment)} />
            </div>
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
              <Form id='employmentForm' style={{ marginTop: 40 }} onSubmit={(e) => this._handleSubmit(e)}>
                <FormGroup>
                  <Label for='employer'>Företag *</Label>
                  <Input type='text' name='employer' id='employer' defaultValue={employment ? employment.employer : ''}
                    ref={(input) => { this.employer = input }} onChange={this._handleInputChange} />
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
                <StartEndDate withCurrent foo={this.state.employment} onChange={this._handleDateChange} />
                <FormGroup>
                  <Label for='description'>Jag bidrar / bidrog med *</Label>
                  <Input type='textarea' name='description' id='description' rows='4' defaultValue={employment ? employment.description : ''}
                    ref={(input) => this.description = input} onChange={this._handleInputChange} />
                </FormGroup>
              </Form>

            </CardBlock>
          }
          </Card>
        </div>
      </Col>
    )
  }
}

export default EmploymentItem
