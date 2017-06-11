import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login } from '../../store/actions/auth'
import { getProfile } from '../../store/actions/profile'
import { getAllEmployments } from '../../store/actions/employments'
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
import Loader from '../../components/Misc/Loader/Loader'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false
    }

    this._handleLogin = this._handleLogin.bind(this)
    this.finalize = this.finalize.bind(this)
  }

  _handleLogin (e) {
    e.preventDefault()

    this.setState({
      loadsave: true
    })

    let { dispatch } = this.props
    let email = ReactDOM.findDOMNode(this.email)
    let password = ReactDOM.findDOMNode(this.password)

    let creds = {
      username: email.value,
      password: password.value
    }

    dispatch(login(creds))
      .then((result) => {
        this.finalize()
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          loadsave: false
        })
      })
  }

  finalize () {
    let { dispatch } = this.props
    let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

    Promise.all([
      this.props.auth.token && dispatch(getProfile(this.props.auth.token)),
      dispatch(getAllEmployments())
    ]).then(() => {
      console.log('redirect')
      this.props.router.push(redirect || '/')
    }).catch((error) => {
      console.log(error)
      this.setState({
        loadsave: false
      })
    })
  }

  render () {
    return (
      <Container className='h-100'>
        <Loader active={this.state.loadsave} />
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
