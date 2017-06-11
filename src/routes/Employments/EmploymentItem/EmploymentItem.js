import React from 'react'
import {
  Card
} from 'reactstrap'

class EmploymentItem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { employment } = this.props
    return (
      <div className='timeline-item'>
        { employment.title }
      </div>
    )
  }
}

export default EmploymentItem
