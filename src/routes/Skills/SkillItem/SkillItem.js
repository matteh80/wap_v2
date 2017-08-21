import React from 'react'
import Slider, { Handle } from 'rc-slider'
import './SkillItem.scss'
import classNames from 'classnames'
import update from 'react-addons-update'
import $ from 'jquery'
import Masonry from 'react-masonry-component'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  Progress
} from 'reactstrap'

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps} style={{ width: 32, height: 32, marginTop: -14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {dragging && <span>{value}</span>}
    </Handle>
  )
}

class SkillItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: this.props.skill.new,
      skill: Object.assign({}, this.props.skill)
    }

    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editMode !== prevState.editMode) {
      this.props.layout()
    }
  }

  toggleEditMode () {
    this.state.editMode && this.props.onChange(this.state.skill)
    this.setState({
      editMode: !this.state.editMode
    })
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      skill: this.props.skill
    })
  }

  onChange (value) {
    this.setState({
      skill: update(this.state.skill, { experience: { $set: value } })
    })
  }

  render () {
    let { skill } = this.props
    let wrapperClass = classNames('btn-wrapper hasRemove', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3} className='skillItem'>
        <Card>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-mail-reply cancel-btn' onClick={() => this.revertChanges()} />
            <i className='fa fa-times remove-btn' onClick={() => this.props.onRemove(skill.id)} />
          </div>
          <CardBlock>
            <CardTitle>{skill.name}</CardTitle>
            {this.state.editMode &&
            <Slider
              min={1}
              max={5}
              handle={handle}
              dots
              value={this.state.skill.experience}
              onChange={(value) => this.onChange(value)}
            />
            }
            {!this.state.editMode &&
            <Progress
              min={1}
              max={5}
              value={skill.experience === 1 ? 1.25 : skill.experience}
              color='info' />
            }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default SkillItem
