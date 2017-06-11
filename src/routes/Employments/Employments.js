import React from 'react'
import { connect } from 'react-redux'
import EmploymentItem from './EmploymentItem/EmploymentItem'

class Employments extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { employments } = this.props.employments
    return (
      <div>
        <div className='timeline'>
          {employments && employments.map((employment) => {
            return <EmploymentItem key={employment.id} employment={employment} />
          })}
        </div>
      </div>
    )
  }
}

export default connect((state) => state)(Employments)
