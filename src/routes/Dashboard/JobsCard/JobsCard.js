import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Col,
  CardBlock,
  CardTitle,
} from 'reactstrap'
import DashboardButtons from '../../../components/buttons/DashboardButtons'

class JobsCard extends React.Component {
  render () {
    let { translate } = this.context
    let { jobs } = this.props

    return (
      <Card style={{ background: '#ffffff' }}>
        <DashboardButtons linkto='jobs' onHide={this.props.onHide} />
        <CardBlock>
          <CardTitle>Visade jobb</CardTitle>
          {jobs.map((job) => {
            return <h6 key={job.id}>{job.title}</h6>
          })}
        </CardBlock>
      </Card>
    )
  }
}

JobsCard.contextTypes = {
  translate: PropTypes.func
}

export default JobsCard
