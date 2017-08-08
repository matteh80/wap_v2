import React from 'react'
import {
  Card,
  CardText,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'

class JobsCard extends React.Component {

  render () {
    let { translate } = this.props
    let { jobs } = this.props

    return (
      <Card style={{ background: '#ffffff' }}>
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

export default JobsCard
