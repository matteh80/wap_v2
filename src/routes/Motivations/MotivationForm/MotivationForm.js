import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyMotivations, getAllMotivations, addMotivation } from '../../../store/actions/motivations'
import $ from 'jquery'
import classNames from 'classnames'

import {
  Card,
  CardBlock,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Collapse
} from 'reactstrap'

class MotivationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: !this.props.notEmpty
    }

    this.props.motivations.length === 0 && dispatch(getAllMotivations())
    dispatch(getMyMotivations())

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleMotivationChange = this._handleMotivationChange.bind(this)
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
    let chevronClass = classNames('fa pull-right', this.state.collapse ? 'fa-chevron-down' : 'fa-chevron-up')

    return (
      <Card>
        <CardHeader onClick={() => this.toggleCollapse()} className='add-items'>
          <CardTitle className='pull-left'>Lägg till drivkrafter</CardTitle>
          <i className={chevronClass} style={{ fontSize: 20 }} />
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBlock>
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
          </CardBlock>
        </Collapse>
      </Card>
    )
  }
}

export default connect((state) => state)(MotivationForm)
