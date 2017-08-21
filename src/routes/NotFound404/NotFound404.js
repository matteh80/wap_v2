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
        <Row className='justify-content-center align-items-center flex-column' style={{ minHeight: '100vh' }}>
          <Col xs='12' md='8' lg='6'>
            <img src='/img/404.png' className='img-fluid' />
          </Col>
          <Col xs='12'>
            <h1 className='text-center'>Oops! Sidan du söker finns inte</h1>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default NotFound404
