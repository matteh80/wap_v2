import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyOccupations, getAllOccupations, addOccupation } from '../../../store/actions/occupations'
import $ from 'jquery'

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

class OccupationForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
    }

    this.props.occupations.length === 0 && dispatch(getAllOccupations())
    dispatch(getMyOccupations())

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
    console.log(value)
    let { dispatch } = this.props
    dispatch(addOccupation(value))
  }

  render () {

    let {userOccupations } = this.props.occupations

    return (
      <Card>
        <CardHeader>
          <CardTitle>Ny befattning</CardTitle>
        </CardHeader>
        <CardBlock>
          <Form>
            <FormGroup>
              <Label for='occupation'>Yrkeskategori *</Label>
              {!this.state.loadsave &&
              <Select
                options={this._getOptions()}
                clearable
                onChange={this._handleOccupationChange}
                placeholder='Välj yrke'
                value={this.state.selectValue}
              />}
            </FormGroup>
          </Form>
        </CardBlock>
      </Card>
    )
  }
}

export default connect((state) => state)(OccupationForm)
