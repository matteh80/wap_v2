import React from 'react'
import Datetime from 'react-datetime'
import $ from 'jquery'
import moment from 'moment'

import {
  Col,
  Row,
  Label,
  FormGroup,
  Input
} from 'reactstrap'

export default class StartEndDate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hasError: false,
      startError: false,
      endError: false,
      startDate: this.props.foo ? moment(this.props.foo.start_date).format('YYYY-MM') : moment().format('YYYY-MM'),
      endDate: this.props.foo ? moment(this.props.foo.end_date).format('YYYY-MM') : moment().format('YYYY-MM'),
      current: this.props.foo ? this.props.foo.current : false,
      editMode: this.props.foo
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCurrentChange = this.handleCurrentChange.bind(this)
  }

  handleInputChange (date) {
    let that = this
    let startDate = this.refs.start_date.state.selectedDate.format('YYYY-MM-DD')
    let endDate = this.refs.end_date.state.selectedDate.format('YYYY-MM-DD')

    this.setState({
      startDate: startDate,
      endDate: endDate
    })

    if (moment(endDate) >= moment(startDate)) {
      $(this.refs.end_date_wrapper).find('input').removeClass('error')
      this.setState({
        endError: false
      })
    } else {
      $(this.refs.end_date_wrapper).find('input').addClass('error')
      this.setState({
        endError: true
      })
    }

    if (moment() >= moment(startDate)) {
      $(this.refs.start_date_wrapper).find('input').removeClass('error')
      this.setState({
        startError: false
      })
    } else {
      $(this.refs.start_date_wrapper).find('input').addClass('error')
      this.setState({
        startError: true
      })
    }

    this.setState({
      hasError: this.state.startError || this.state.endError
    })

    setTimeout(function () {
      that.props.onChange(startDate, endDate, that.state.startError || that.state.endError, that.state.current)
    }, 500)
  }

  handleCurrentChange (event) {
    let that = this
    const target = event.target

    this.setState({
      current: target.checked,
      endDate: moment().format('YYYY-MM')
    })

    if (target.checked) {
      $('#end_date_wrapper').slideUp()
    } else {
      $('#end_date_wrapper').slideDown()
    }

    setTimeout(function () {
      console.log('update ' + target.checked)
      that.props.onChange(that.state.startDate, that.state.endDate, that.state.startError || that.state.endError, target.checked)
    }, 500)
  }

  render () {
    return (
      <Row>
        <Col xs={12} sm={6}>
          <div ref='start_date_wrapper'>
            <FormGroup>
              <Label>Startdatum *</Label>
              <Datetime
                ref='start_date'
                defaultValue={this.state.startDate}
                onBlur={this.handleInputChange}
                name='start_date'
                required
                dateFormat='YYYY-MM'
                timeFormat={false}
              />
              {this.state.startError &&
              <label id='start_date-error' className='error'>Startdatum får inte vara i framtiden</label>
              }
            </FormGroup>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div ref='end_date_wrapper' id='end_date_wrapper'>
            <FormGroup id='end_date' style={{ display: this.state.editMode && this.props.foo.current ? 'none' : 'block' }}>
              <Label>Slutdatum *</Label>
              <Datetime
                ref='end_date'
                defaultValue={this.state.endDate}
                onBlur={this.handleInputChange}
                name='end_date'
                required
                dateFormat='YYYY-MM'
                timeFormat={false}
              />
              {this.state.endError &&
              <label id='end_date-error' className='error'>Slutdatum måste vara efter startdatum</label>
              }
            </FormGroup>
          </div>
        </Col>
        {this.props.withCurrent &&
        <Col xs={12}>
          <FormGroup>
            <Input type='checkbox' ref={(checkbox) => this.current = checkbox} onClick={this.handleCurrentChange}
              defaultChecked={this.props.foo && this.props.foo.current} name='current' />{' '}
            Nuvarande anställning
          </FormGroup>
        </Col> }
      </Row>
    )
  }
}
