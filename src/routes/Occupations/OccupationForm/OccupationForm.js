import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyOccupations, getAllOccupations, addOccupation } from '../../../store/actions/occupations'
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

class OccupationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: this.props.occupations.userOccupations.length === 0
    }

    this.props.occupations.length === 0 && dispatch(getAllOccupations())
    dispatch(getMyOccupations())

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleOccupationChange = this._handleOccupationChange.bind(this)
  }

  _getOptions () {
    let { occupations, userOccupations } = this.props.occupations
    let optiondata = []
    let index = -1

    $.each(occupations, function (i, categoryitem) {
      $.each(categoryitem.occupations, function (x, item) {
        index = userOccupations.findIndex(userOccupations => userOccupations.id === item.id)
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

  _handleOccupationChange (value) {
    this.props.onAdd(value)
  }

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  render () {
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let newHeight = $('.occupationItem .card').height()
    let itemClass = classNames('fakeItem', this.state.collapse && 'fullOpacity')

    return (
      <Card className={itemClass} style={{ minHeight: newHeight }}>
        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            Lägg till ny befattning
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
        </div>

        <CardBlock>
          {!this.state.collapse && <div className='fakeTitle mb-0 mr-1' style={{ width: 20, height: 16, float: 'left' }} />}
          {!this.state.collapse ? <div className='fakeTitle mb-0' style={{ float: 'left', height: 16 }} /> : <CardTitle>Ny kompetens</CardTitle>}
          <Collapse isOpen={this.state.collapse}>
            <Form>
              <FormGroup>
                {/* <Label for='occupation'>Yrkeskategori *</Label> */}
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this._handleOccupationChange}
                  placeholder='Välj yrke'
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

export default connect((state) => state)(OccupationForm)
