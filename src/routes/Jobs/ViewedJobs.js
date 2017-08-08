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

class ViewedJobs extends React.Component {

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  handleClick (id) {
    this.props.router.push('/jobs/' + id)
  }

  onRemove (job) {
    let { dispatch } = this.props
    dispatch(removeJob(job))
  }

  render () {
    let { savedJobs } = this.props.jobs

    return (
      <Container fluid>
        <Row>
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
            <Card className='speechBubble'>
              <CardBlock>
                <p>Här hittar du dina tjänster du visat denna session för att enklare kunna hitta tillbaka och skicka en ansökan.</p>
                <p>Observera att den här listan töms om du loggar ut samt att tjänster du var inne på för över en vecka sen inte visas.</p>
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(ViewedJobs))
