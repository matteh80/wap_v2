import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyMotivations, getAllMotivations, addMotivation } from '../../../store/actions/motivations'
import $ from 'jquery'
import classNames from 'classnames'

import {
  Card,
  CardBlock,
  CardTitle,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Collapse
} from 'reactstrap'

class MotivationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    this.state = {
      selectValue: null,
      collapse: this.props.motivations.userMotivations.length === 0,
      disabled: this.props.motivations.userMotivations.length === 3
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleMotivationChange = this._handleMotivationChange.bind(this)
  }

  componentWillUpdate (newProps, newState) {
    if (newProps.motivations.userMotivations.length !== this.props.motivations.userMotivations.length) {
      this.setState({
        disabled: newProps.motivations.userMotivations.length === 3,
        collapse: false
      })
    }
  }

  _getOptions () {
    let { motivations, userMotivations } = this.props.motivations
    let optiondata = []
    let index = -1

    $.each(motivations, function (i, item) {
      index = userMotivations.findIndex(userMotivations => userMotivations.id === item.id)
      if (index === -1) {
        optiondata.push({
          label: item.name,
          value: item.id,
          name: item.name,
          id: item.id,
        })
      }
    })

    optiondata.sort(function (a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  _handleMotivationChange (value) {
    this.props.onAdd(value)
  }

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  render () {
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : this.state.disabled ? 'fa-exclamation-triangle bg-red' : 'fa-plus bg-green')
    let newHeight = $('.occupationItem .card').height()
    let itemClass = classNames('fakeItem', this.state.disabled && 'disabled')

    return (
      <Card className={itemClass} style={{ minHeight: newHeight }}>
        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            {this.state.disabled
            ? 'Max tre drivkrafter'
            : 'Lägg till drivkraft'
            }
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={!this.state.disabled && this.toggleCollapse} />
        </div>

        <CardBlock>
          {!this.state.collapse && <div className='fakeTitle mb-0 mr-1' style={{ width: 20, height: 16, float: 'left' }} />}
          {!this.state.collapse ? <div className='fakeTitle mb-0' style={{ float: 'left', height: 16 }} /> : <CardTitle>Ny drivkraft</CardTitle>}
          <Collapse isOpen={this.state.collapse}>
            <Form>
              <FormGroup>
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this._handleMotivationChange}
                  placeholder='Välj drivkraft'
                  value={this.state.selectValue}
                />
              </FormGroup>
            </Form>
          </Collapse>
        </CardBlock>
      </Card>
    )
  }
}

export default connect((state) => state)(MotivationForm)
