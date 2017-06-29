import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getMyLicenses, getAllLicenses } from '../../../store/actions/drivinglicenses'
import $ from 'jquery'
import classNames from 'classnames'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Collapse
} from 'reactstrap'

class LicenseForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: !this.props.notEmpty
    }

    this.props.drivinglicenses.length === 0 && dispatch(getAllLicenses())
    dispatch(getMyLicenses())

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleLicenseChange = this._handleLicenseChange.bind(this)
  }

  _getOptions () {
    console.log('GET OPTIONS')
    let { licenses, userLicenses } = this.props.drivinglicenses
    let optiondata = []
    let index = -1

    $.each(licenses, function (i, item) {
      index = userLicenses.findIndex(userLicenses => userLicenses.id === item.id)
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

  _handleLicenseChange (value) {
    this.props.onAdd(value)
  }

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.collapse !== prevState.collapse) {
      this.props.layout()
    }
  }

  render () {
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let newHeight = $('.licenseItem .card').height()

    return (
      <Col xs={12} sm={6} md={3} xl={this.state.collapse ? 4 : 2}>
        <Card className='formCard fakeItem' style={{ minHeight: newHeight }}>
          <div className='btn-wrapper'>
            <UncontrolledTooltip placement='left' target='add-btn'>
              Lägg till nytt körkort
            </UncontrolledTooltip>
            <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
          </div>

          <CardBlock>
            {!this.state.collapse ? <div className='fakeTitle w-25' /> : <CardTitle>Nytt körkort</CardTitle>}
            {!this.state.collapse && <div className='licenseInfo'><div className='fakeLicenseIcon licenseIcon' /></div>}
            <Collapse isOpen={this.state.collapse}>
              <Form>
                <FormGroup>
                  <Select
                    options={this._getOptions()}
                    clearable
                    onChange={this._handleLicenseChange}
                    placeholder='Välj körkort'
                    value={this.state.selectValue}
                  />
                </FormGroup>
              </Form>
            </Collapse>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(LicenseForm)
