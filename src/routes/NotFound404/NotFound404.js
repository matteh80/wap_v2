import React from 'react'
import {
  Container,
  Row,
  Col
} from 'reactstrap'

class NotFound404 extends React.Component {

  render () {
    return (
      <Container>
        <Row className='justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
          <Col>
            <h1 className='text-center'>Oops! Sidan du söker finns inte</h1>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default NotFound404
