import React from 'react'
import { withRouter } from 'react-router'
import {
  Container,
  Row,
  Col
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'

class NotFound404 extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.router.push('/')
  }

  render () {
    return (
      <Container>
        <Row className='justify-content-center align-items-center flex-column' style={{ minHeight: '100vh' }}>
          <Col xs='12' md='8' lg='6'>
            <img src='/img/oops.png' className='img-fluid' />
          </Col>
          <Col xs='12'>
            <h1 className='text-center'>Oops! Sidan du söker finns inte</h1>
            <h1 className='text-center' style={{ fontSize: 50 }}>404</h1>
            <ThreeDButton className='btn-white d-block mx-auto' onClick={() => this.handleClick()}>Gå till dashboard</ThreeDButton>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(NotFound404)
