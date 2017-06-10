import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login } from '../../store/actions/auth'
import { getProfile } from '../../store/actions/profile'
import ThreeDButton from '../../components/buttons/ThreeDButton'

import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this._handleLogin = this._handleLogin.bind(this)
  }

  _handleLogin (e) {
    e.preventDefault()
    let { dispatch } = this.props
    let email = ReactDOM.findDOMNode(this.email)
    let password = ReactDOM.findDOMNode(this.password)

    let creds = {
      username: email.value,
      password: password.value
    }

    let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

    dispatch(login(creds)).then((result) => {
      this.props.auth.token && dispatch(getProfile(this.props.auth.token)).then(() => {
        console.log('redirect')
        this.props.router.push(redirect || '/')
      })
    })
  }

  render () {
    return (
      <Container className='h-100'>
        <Row className='justify-content-center align-items-center h-100 flex-column'>
          <Col xs={12} sm={8} md={6}>
            <Row>
              <img src='img/wap_logga.png' />
            </Row>
            <Row className='social justify-content-center align-items-center'>
              <i className='fa fa-facebook-official' />
              <i className='fa fa-linkedin-square' />
              <i className='fa fa-google-plus-official' />
            </Row>
            <Row>
              <Form className='w-100' onSubmit={(e) => this._handleLogin(e)}>
                <FormGroup>
                  <Label for='email'>Email</Label>
                  <Input type='email' name='email' id='email' placeholder='E-post' ref={(input) => this.email = input} />
                </FormGroup>
                <FormGroup>
                  <Label for='password'>Password</Label>
                  <Input type='password' name='password' id='password' placeholder='Lösenord' ref={(input) => this.password = input} />
                </FormGroup>
                <ThreeDButton type='submit' className='w-100'>Logga in</ThreeDButton>
              </Form>
            </Row>

          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(Login))
