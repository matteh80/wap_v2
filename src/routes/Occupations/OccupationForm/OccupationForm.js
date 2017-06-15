import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyOccupations, getAllOccupations, addOccupation } from '../../../store/actions/occupations'
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

class OccupationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: !this.props.notEmpty
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
    let chevronClass = classNames('fa pull-right', this.state.collapse ? 'fa-chevron-down' : 'fa-chevron-up')

    return (
      <Card>
        <CardHeader onClick={() => this.toggleCollapse()} className='add-items'>
          <CardTitle className='pull-left'>Lägg till befattning</CardTitle>
          <i className={chevronClass} style={{ fontSize: 20 }} />
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBlock>
            <Form>
              <FormGroup>
                {/*<Label for='occupation'>Yrkeskategori *</Label>*/}
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this._handleOccupationChange}
                  placeholder='Välj yrke'
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

export default connect((state) => state)(OccupationForm)
