import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import { removeJob } from '../../store/actions/jobs'
import EditButtons from '../../components/buttons/EditButtons'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

class ViewedJobs extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  handleClick (id) {
    if (id) {
      this.props.router.push('/jobs/' + id)
    }
  }

  onRemove (job) {
    let { dispatch } = this.props
    dispatch(removeJob(job))
  }

  render () {
    let { savedJobs } = this.props.jobs

    return (
      <Container fluid>
        <Row className='flex-column-reverse flex-lg-row'>
          <Col>
            {savedJobs && savedJobs.map((job) => {
              return (
                <Card key={job.id}>
                  <EditButtons onlyRemove onRemove={() => this.onRemove(job)} translate={this.props.translate} />
                  <CardBlock>
                    <CardTitle onClick={() => this.handleClick(job.id)} style={{ cursor: 'pointer' }}>
                      {job.title}
                    </CardTitle>
                  </CardBlock>
                </Card>
              )
            })}
          </Col>
          <Col xs={12} sm={12} md={12} lg={5}>
            <SpeechBubble pos='left-side top'>
              <p>Här hittar du dina tjänster du visat under denna session. Det för att du enklare ska hitta tillbaka och kunna skicka din ansökan.</p>
              <p>Observera att den här listan töms om du loggar ut.</p>
            </SpeechBubble>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(ViewedJobs))
