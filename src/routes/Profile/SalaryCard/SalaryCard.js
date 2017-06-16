import React from 'react'
import { connect } from 'react-redux'
import '../Profile.scss'
import classNames from 'classnames'
import { Range } from 'rc-slider'

import {
  Col,
  Card,
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
  }

  toggleEditMode () {
    this.state.editMode && this.props.onSave()
    this.setState({
      editMode: !this.state.editMode
    })
  }

  onSalaryChange (values) {
    this.setState({
      salary: values
    })
  }

  render () {
    let { profile } = this.props

    let editBtnClass = classNames('edit-btn fa', this.state.editMode ? 'fa-check editing' : 'fa-pencil')

    return (
      <Col xs={12} sm={6} md={4} xl={3}>
        <Card className='profileCard'>
          <i className={editBtnClass} onClick={() => this.toggleEditMode()} />
          <img src='/img/cash.jpg' className='img-fluid' />
          <CardBlock>
            <CardTitle className='text-center'>Lön</CardTitle>
            <CardSubtitle className='text-center'>{this.state.salary[0]}
              - {this.state.salary[1]}</CardSubtitle>
            {this.state.editMode &&
            <Range
              min={15000}
              max={95000}
              step={500}
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
