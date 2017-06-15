import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import $ from 'jquery'
import classNames from 'classnames'

import {
  Collapse,
  Card,
  CardBlock,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
} from 'reactstrap'

class LanguageForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: !this.props.notEmpty
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleLanguageChange = this._handleLanguageChange.bind(this)
  }

  _getOptions () {
    let { languages } = this.props.languages
    let { userLanguages } = this.props
    let optiondata = []
    let index = -1

    $.each(languages, function (i, item) {
      index = userLanguages.findIndex(userLanguages => userLanguages.id === item.id)
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

  _handleLanguageChange (value) {

  }

  toggleCollapse () {
    this.setState({ collapse: !this.state.collapse })
  }

  render () {
    let { userLanguages } = this.props.languages
    let chevronClass = classNames('fa pull-right', this.state.collapse ? 'fa-chevron-down' : 'fa-chevron-up')

    return (
      <Card>
        <CardHeader onClick={() => this.toggleCollapse()} className='add-items'>
          <CardTitle className='pull-left'>Lägg till språk</CardTitle>
          <i className={chevronClass} style={{ fontSize: 20 }} />
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBlock>
            <Form>
              <FormGroup>
                {/* <Label for='language'>Kompetens</Label> */}
                {this.props.languages.userLanguages &&
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this.props.onAdd}
                  placeholder='Välj språk'
                  value={this.state.selectValue}
                />}
              </FormGroup>
            </Form>
          </CardBlock>
        </Collapse>
      </Card>
    )
  }
}

export default connect((state) => state)(LanguageForm)
