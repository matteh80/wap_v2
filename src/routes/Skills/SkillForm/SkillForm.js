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
  Form,
  FormGroup,
  UncontrolledTooltip
} from 'reactstrap'

class SkillForm extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props

    this.state = {
      selectValue: null,
      collapse: this.props.skills.userSkills.length === 0
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
    this._getOptions = this._getOptions.bind(this)
    this._handleSkillChange = this._handleSkillChange.bind(this)
  }

  _getOptions () {
    let { skills } = this.props.skills
    let { userSkills } = this.props
    let optiondata = []
    let index = -1

    $.each(skills, function (i, categoryitem) {
      $.each(categoryitem.skills, function (x, item) {
        index = userSkills.findIndex(userSkills => userSkills.id === item.id)
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

  _handleSkillChange (value) {

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
    let { userSkills } = this.props.skills
    let chevronClass = classNames('fa add-btn', this.state.collapse ? 'fa-chevron-down bg-orange' : 'fa-plus bg-green')
    let newHeight = $('.skillItem .card').height()
    let itemClass = classNames('fakeItem', this.state.collapse && 'fullOpacity')

    return (
      <Card className={itemClass} style={{ minHeight: newHeight }}>

        <div className='btn-wrapper'>
          <UncontrolledTooltip placement='left' target='add-btn'>
            Lägg till ny kompetens
          </UncontrolledTooltip>
          <i className={chevronClass} id='add-btn' onClick={() => this.toggleCollapse()} />
        </div>

        <CardBlock>
          {!this.state.collapse ? <div className='fakeTitle' /> : <CardTitle>Ny kompetens</CardTitle>}
          {!this.state.collapse && <div className='fakeSlider' />}

          <Collapse isOpen={this.state.collapse}>
            <Form>
              <FormGroup>
                {/* <Label for='skill'>Kompetens</Label> */}
                {this.props.skills.userSkills &&
                <Select
                  options={this._getOptions()}
                  clearable
                  onChange={this.props.onAdd}
                  placeholder='Välj kompetens'
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

export default connect((state) => state)(SkillForm)
