import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login, socialLogin } from '../../store/actions/auth'
import { getProfile, updateProfile } from '../../store/actions/profile'
import { getAllEmployments, createEmployment } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'
import { getAllOccupations, getMyOccupations } from '../../store/actions/occupations'
import { getAllSkills, getMySkills } from '../../store/actions/skills'
import { getAllLanguages, getMyLanguages } from '../../store/actions/languages'
import { getAllMotivations, getMyMotivations } from '../../store/actions/motivations'
import { getAllPersonalities, getMyPersonalities } from '../../store/actions/personalities'
import { getVideoInfo } from '../../store/actions/wapfilm'
import { getAllLicenses, getMyLicenses } from '../../store/actions/drivinglicenses'
import { getAllReferences } from '../../store/actions/references'
import { getAllQuestions } from '../../store/actions/dreamjob'
import { getAllLocations } from '../../store/actions/locations'
import { getTestStatus } from '../../store/actions/talentq'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import './Login.scss'
import $ from 'jquery'
import graph from 'fb-react-sdk'
import URLSearchParams from 'url-search-params'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'

import {
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Alert
} from 'reactstrap'

import Loader from '../../components/Misc/Loader/Loader'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

let auth2
let redirect = null
let provider = null

class Login extends React.Component {
  constructor (props) {
    super(props)

    redirect = props.routing.locationBeforeTransitions ? props.routing.locationBeforeTransitions.query.redirect : null

    this.state = {
      loadsave: false,
      linkedIn: false,
      job: _.includes(_.words(redirect), 'jobs'),
      jobTitle: null,
      socialLogin: false
    }

    this._handleLogin = this._handleLogin.bind(this)
    this.finalize = this.finalize.bind(this)
    this.loginLinkedIn = this.loginLinkedIn.bind(this)
    this.getLinkedInData = this.getLinkedInData.bind(this)
    this.setUpProfileFromLinkedIn = this.setUpProfileFromLinkedIn.bind(this)
    this.loadFB = this.loadFB.bind(this)
    this.loginFB = this.loginFB.bind(this)
    this.loadGoogle = this.loadGoogle.bind(this)
    this.auth = this.auth.bind(this)
    this.signInCallback = this.signInCallback.bind(this)
    this.gotoRegister = this.gotoRegister.bind(this)
  }

  componentDidMount () {
    if (this.state.job) {
      let jobId = _.words(redirect)[1]
      axios.get('https://api.wapcard.se/api/v1/jobs/' + jobId).then((result) => {
        this.setState({
          jobTitle: result.data.title
        })
      })
    }

    $.getScript('https://apis.google.com/js/client:platform.js', this.loadGoogle)

    let liRoot = document.createElement('div')
    liRoot.id = 'linkedin-root'

    document.body.appendChild(liRoot);

    (function (d, s, id) {
      const element = d.getElementsByTagName(s)[0]
      const ljs = element
      let js = element
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//platform.linkedin.com/in.js'
      js.type = 'text/javascript'
      js.text = 'api_key: 86fnbibk2t9g4m'
      ljs.parentNode.insertBefore(js, ljs)
    }(document, 'script', 'linkedin-sdk'))

    let { dispatch } = this.props

    provider = this.props.route.path === '/login/linkedin' ? 'linkedin-oauth2' : 'facebook'

    let mRedirectUri
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      mRedirectUri = 'http://localhost:3000' + this.props.route.path
    } else {
      // production code
      mRedirectUri = 'https://app.wapcard.se' + this.props.route.path
    }

    let urlParams = new URLSearchParams(window.location.search)
    let authCode = urlParams.getAll('code')[0]
    if (authCode) {
      if (authCode.length > 10) {
        this.setState({
          socialLogin: true
        })
        let loginData = { 'provider': provider, 'code': authCode, 'redirect_uri': mRedirectUri }
        dispatch(socialLogin(loginData)).then(() => {
          // if (provider === 'linkedin-oauth2') {
          //   dispatch(getProfile()).then((result) => {
          //     console.log(result)
          //     if (result.tos_accepted) {
          //       this.finalize()
          //     } else {
          //       this.setState({
          //         linkedIn: true
          //       })
          //     }
          //   })
          // } else {
          //   this.finalize()
          // }
          this.finalize()
        })
      }
    }
  }

  getLinkedInData () {
    let _self = this
    IN.User.authorize(function () {
      IN.API.Profile('me').fields(
        [
          'firstName', 'lastName', 'formatted-name', 'specialties', 'headline', 'summary', 'positions:(company,title,summary,startDate,endDate,isCurrent)', 'industry',
          'location:(name,country:(code))', 'pictureUrl', 'publicProfileUrl', 'emailAddress',
          'educations', 'dateOfBirth'
        ]
      ).result(function (profiles) {
        _self.setUpProfileFromLinkedIn(profiles.values[0])
      })
    })
  }

  setUpProfileFromLinkedIn (p) {
    let { dispatch } = this.props
    console.log(p)
    let mEmployment = null

    let mProfile = {
      first_name: p.firstName,
      last_name: p.lastName,
      title: p.headline,
      address: null,
      care_of: null,
      city: null,
      mobile_phone_number: '000',
      personal_info: null,
      phone_number: null,
      zip_code: null,
      actively_searching: true,
      student: false
    }

    if (p.positions && this.props.employments.employments.length === 0) {
      mEmployment = {
        title: p.positions.values[0].title,
        employer: p.positions.values[0].company.name,
        occupation: 'cb2521a7-cf81-443c-b3c4-bb5edca8af69',
        description: p.positions.values[0].company.industry,
        current: true,
        end_date: moment().format('YYYY-MM-DD'),
        start_date: moment().year(p.positions.values[0].startDate.year).month(p.positions.values[0].startDate.month - 1).startOf('month').format('YYYY-MM-DD')
      }
    }

    Promise.all([
      dispatch(updateProfile(mProfile)),
      mEmployment && dispatch(createEmployment(mEmployment))
    ]).then(() => {
      this.finalize()
    }).catch((error) => {
      console.log(error)
      this.setState({
        loadsave: false
      })
    })
  }

  loginLinkedIn () {
    cookies.set('redirect', redirect, { path: '/', maxAge: 60 })
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      window.location.assign('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=http%3A%2F%2Flocalhost:3000%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile')
    } else {
      // production code
      window.location.assign('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=https%3A%2F%2Fapp.wapcard.se%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile')
    }
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
        this.setState({
          loadsave: false,
          loginError: true
        })
      })
  }

  loadFB () {
    // TODO: Change to prod appid
    window.fbAsyncInit = function () {
      FB.init({
        appId      : '1021816071285498',
        xfbml      : true,
        version    : 'v2.10'
      })
      FB.AppEvents.logPageView()
    };

    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  }

  loginFB () {
    cookies.set('redirect', redirect, { path: '/', maxAge: 3600 })
    let mRedirectUri
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      mRedirectUri = 'http://localhost:3000/login/facebook'
    } else {
      // production code
      mRedirectUri = 'https://app.wapcard.se/login/facebook'
    }

    graph.setVersion('2.9')
    //
    let authUrl = graph.getOauthUrl({
      'client_id':     '1021816071285498',
      'redirect_uri':  mRedirectUri,
      'scope':         'email'
    })

    window.location.assign(authUrl)
  }

  loadGoogle () {
    console.log('loadGoogle')
    gapi.load('auth2', function () {
      gapi.auth2.init({
        client_id: '369307759639-bn22hfm88ttjg2letf87c21jkmvapldd.apps.googleusercontent.com',
        // Scopes to request in addition to 'profile' and 'email'
        // scope: 'openid'
      })
    })
    console.log(gapi)
  }

  signInCallback (authResult) {
    cookies.set('redirect', redirect, { path: '/', maxAge: 3600 })
    let { dispatch } = this.props

    console.log('signInCallback')

    if (authResult['code']) {
      let loginData = { 'provider': 'google-oauth2', 'code': authResult['code'], 'redirect_uri': 'postmessage' }
      dispatch(socialLogin(loginData)).then(() => {
        this.finalize()
      })
    }
  }

  auth () {
    console.log('auth')
    gapi.auth2.getAuthInstance().grantOfflineAccess().then(this.signInCallback)
  }

  finalize () {
    let { dispatch } = this.props
    this.props.auth.token && dispatch(getProfile(this.props.auth.token)).then((result) => {
      let cookieRedirect = cookies.get('redirect', { path: '/', maxAge: 60 })
      let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

      if (cookieRedirect !== undefined) {
        console.log('ccokie')
        redirect = cookieRedirect
      }

      cookies.remove('redirect', redirect, { path: '/', maxAge: 60 })

      Promise.all([
        dispatch(getAllEmployments()),
        dispatch(getAllEducations()),
        dispatch(getAllOccupations()),
        dispatch(getMyOccupations()),
        dispatch(getAllSkills()),
        dispatch(getMySkills()),
        dispatch(getAllLanguages()),
        dispatch(getMyLanguages()),
        dispatch(getAllMotivations()),
        dispatch(getMyMotivations()),
        dispatch(getAllPersonalities()),
        dispatch(getMyPersonalities()),
        dispatch(getVideoInfo()),
        dispatch(getAllLicenses()),
        dispatch(getMyLicenses()),
        dispatch(getAllReferences()),
        dispatch(getAllQuestions()),
        dispatch(getAllLocations()),
        dispatch(getTestStatus()),
      ]).catch((error) => {
        console.log(error)
        this.setState({
          loadsave: false
        })
        // if (result.tos_accepted) {
        //   console.log('redirect')
        //   console.log(redirect)
        //   this.props.router.push(redirect || '/')
        // } else {
        //   if (redirect) {
        //     this.props.router.push('/signup?redirect=' + redirect)
        //   } else {
        //     this.props.router.push('/signup')
        //   }
        // }
      })
        .then(() => {
          if (redirect === 'undefined') {
            redirect = '/'
          }
          if (result.tos_accepted) {
            console.log('redirect')
            console.log(redirect)
            this.props.router.push(redirect || '/')
          } else {
            if (redirect) {
              this.props.router.push('/signup?redirect=' + redirect)
            } else {
              this.props.router.push('/signup')
            }
          }
        })
    })
  }

  gotoRegister (e) {
    e.preventDefault()
    if (redirect) {
      this.props.router.push('/register?redirect=' + redirect)
    } else {
      this.props.router.push('/register')
    }
  }

  render () {
    let { translate } = this.context

    return (
      <Col>
        <Row className='justify-content-center align-items-center flex-column' style={{ minHeight: '100vh' }}>
          <Container>
            {this.state.job &&
            <Row className='justify-content-center align-items-center'>
              <Col xs={12} lg={8} xl={6}>
                <h4 className='text-center'>{translate('login.login_apply')}</h4>
                <h3 className='text-center'>{this.state.jobTitle}</h3>
              </Col>
            </Row>
            }
            <Row className='justify-content-center align-items-center'>
              <Col xs={8} sm={6} md={4} lg={4} xl={3}>
                <a href='https://wapcard.se'>
                  <img src='/img/wap_logga.png' className='img-fluid mx-auto d-block' />
                </a>
              </Col>
              {!this.state.linkedIn && !this.state.socialLogin &&
              <Col xs={12}>
                <Row className='social justify-content-center align-items-center mt-3'>
                  <i className='fa fa-facebook' id='facebook-btn' onClick={() => this.loginFB()} />
                  <i className='fa fa-linkedin mx-4' id='linkedin-btn' onClick={() => this.loginLinkedIn()} />
                  <i className='fa fa-google' id='google-btn' onClick={() => this.auth()} />
                </Row>
              </Col>
              }
              {!this.state.linkedIn && !this.state.socialLogin &&
              <Col xs={12} lg={8} xl={6}>
                <div className='lineBeforeAfter justify-content-center align-content-center my-4'>
                  <h4 className='orText'>ELLER</h4>
                </div>
                {this.state.loginError &&
                <Alert color='danger'>
                  <strong>Ajdå!</strong> Det gick inte att logga in med den här användarnamnet och lösenordet.
                  Kontrollera dina uppgifter och försök igen!
                </Alert>
                }
                <Form className='w-100 loginForm' onSubmit={(e) => this._handleLogin(e)}>
                  <FormGroup>
                    {/* <Label for='email'>Email</Label> */}
                    <Input type='email' name='email' id='email' placeholder='E-post'
                      ref={(input) => { this.email = input }} required />
                  </FormGroup>
                  <FormGroup>
                    {/* <Label for='password'>Password</Label> */}
                    <Input type='password' name='password' id='password' placeholder='Lösenord'
                      ref={(input) => { this.password = input }} required minLength='8' />
                  </FormGroup>
                  <ThreeDButton type='submit' className='w-100' loading={this.state.loadsave}>Logga in</ThreeDButton>
                </Form>
                <h5 className='text-center mt-2'>Har du inget konto? <a href='/register' className='fg-pink' onClick={(e) => this.gotoRegister(e)}>Registrera</a> dig!</h5>
                <a href='https://app.wapcard.se/password/reset/' className='text-center fg-pink'><h6>Glömt ditt lösenord?</h6></a>
              </Col>
              }
              {this.state.linkedIn &&
              <Col xs={12} className='mt-5'>
                <Card>
                  <CardBlock>
                    <CardTitle>Du loggade in med LinkedIn</CardTitle>
                    <CardSubtitle>Vill du hämta data (jobb, profil mm) från din profil?</CardSubtitle>
                    <ThreeDButton onClick={() => this.getLinkedInData()}>Hämta data</ThreeDButton>
                    <a href='#' style={{ marginLeft: 10 }} onClick={() => this.finalize()}> Nej tack, jag vill fylla i mina uppgifter själv</a>
                  </CardBlock>

                </Card>
              </Col>
              }
            </Row>
            {this.state.socialLogin &&
            <Row className='justify-content-center align-items-center mt-5'>
              <div id='loader' className='ball-scale-ripple-multiple'>
                <div />
                <div />
                <div />
              </div>
            </Row>
            }
          </Container>
        </Row>
      </Col>
    )
  }
}

Login.contextTypes = {
  translate: PropTypes.func
}

export default withRouter(connect((state) => state)(Login))
