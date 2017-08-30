import React from 'react'
import { connect } from 'react-redux'
import '../Profile.scss'
import classNames from 'classnames'
import { Range } from 'rc-slider'

import {
  Col,
  Card,
  CardImg,
  CardBlock,
  CardTitle,
  CardSubtitle,
} from 'reactstrap'

class SalaryCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      salary: [this.props.profile.salary_expectations_min, this.props.profile.salary_expectations_max]
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.onSalaryChange = this.onSalaryChange.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
    this.props.onOpen()
  }

  onSalaryChange (values) {
    this.setState({
      salary: values
    })
  }

  revertChanges () {
    this.setState({
      editMode: !this.state.editMode,
      salary: [this.props.profile.salary_expectations_min, this.props.profile.salary_expectations_max]
    })
    this.props.revertChanges()
  }

  render () {
    let { profile, translate } = this.props

    let wrapperClass = classNames('btn-wrapper', this.state.editMode && 'editing')
    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <div className={wrapperClass}>
            <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
            <i className='fa fa-times cancel-btn' onClick={() => this.revertChanges()} />
          </div>
          <CardImg src='/img/lon.png' className='img-fluid' />
          <CardBlock>
            <CardTitle className='text-center'>{translate('salary.salary')}</CardTitle>
            <CardSubtitle className='text-center'>{this.state.salary[0]} - {this.state.salary[1]} kr</CardSubtitle>
            {this.state.editMode &&
            <Range
              min={15000}
              max={95000}
              step={500}
              value={this.state.salary}
              defaultValue={this.state.salary}
              onChange={this.onSalaryChange}
              onAfterChange={this.props.onChange}
            />
            }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default connect((state) => state)(SalaryCard)
