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

class ViewedJobs extends React.Component {

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (id) {
    this.props.router.push('/jobs/' + id)
  }

  render () {
    let { savedJobs } = this.props.jobs

    return (
      <Container fluid>
        <Row>
          <Col>
            {savedJobs && savedJobs.map((job) => {
              return (
                <Card key={job.id} onClick={() => this.handleClick(job.id)}>
                  <CardBlock>
                    <CardTitle>
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
