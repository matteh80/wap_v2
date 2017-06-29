import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import $ from 'jquery'
import classNames from 'classnames'

import {
  Collapse,
  Card,
  CardBlock,
  CardTitle,
  UncontrolledTooltip,
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

  componentDidUpdate (prevProps, prevState) {
    if (this.state.collapse !== prevState.collapse) {
      this.props.layout()
    }
  }

  render () {
    let { userLanguages } = this.props.languages
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let newHeight = $('.languageItem .card').height()

    return (
      <Card className='formCard fakeItem'>
        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            Lägg till nytt språk
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
        </div>

        <CardBlock>
          {!this.state.collapse ? <div className='fakeTitle' /> : <CardTitle>Nytt språk</CardTitle>}
          {!this.state.collapse && <div className='mb-2'><div className='fakeSlider' /></div>}
          {!this.state.collapse && <div><div className='fakeSlider secondSlider' /></div>}
          <Collapse isOpen={this.state.collapse}>
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
          </Collapse>
        </CardBlock>
      </Card>
    )
  }
}

export default connect((state) => state)(LanguageForm)
