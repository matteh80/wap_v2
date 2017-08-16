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
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card style={{ background: '#ffffff' }}>
          <DashboardButtons linkto='jobs' />
          <CardBlock>
            <CardTitle>Visade jobb</CardTitle>
            {jobs.map((job) => {
              return <h6 key={job.id}>{job.title}</h6>
            })}
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

JobsCard.contextTypes = {
  translate: PropTypes.func
}

export default JobsCard
