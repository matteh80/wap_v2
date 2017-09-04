import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { register, socialLogin } from '../../store/actions/auth'
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
import ThreeDButton from '../../components/buttons/ThreeDButton'
// import './Login.scss'
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
  Label,
  Alert
} from 'reactstrap'

import { AvField, AvGroup, AvForm } from 'availity-reactstrap-validation'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

let auth2
let redirect = null
let provider = null

class Register extends React.Component {
  constructor (props) {
    super(props)

    redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

    this.state = {
      loadsave: false,
      linkedIn: false,
      job: _.includes(_.words(redirect), 'jobs'),
      jobTitle: null,
      socialLogin: false,
      errorMsg: null
    }

    this._handleRegister = this._handleRegister.bind(this)
    this.finalize = this.finalize.bind(this)
    this.loginLinkedIn = this.loginLinkedIn.bind(this)
    this.getLinkedInData = this.getLinkedInData.bind(this)
    this.setUpProfileFromLinkedIn = this.setUpProfileFromLinkedIn.bind(this)
    this.loadFB = this.loadFB.bind(this)
    this.loginFB = this.loginFB.bind(this)
    this.loadGoogle = this.loadGoogle.bind(this)
    this.auth = this.auth.bind(this)
    this.signInCallback = this.signInCallback.bind(this)
    this.gotoLogin = this.gotoLogin.bind(this)
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
      mRedirectUri = 'https://wapcard.se' + this.props.route.path
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

  _handleRegister (event, errors, values) {
    event.preventDefault()
    let { dispatch } = this.props
    console.log(errors)
    // console.log(values)
    if (errors.length === 0) {
      this.setState({
        loadsave: true
      })

      dispatch(register(values))
        .then((result) => {
          this.finalize()
        })
        .catch((error) => {
          console.log('ERROR!')
          console.log(error.response.data)
          let errorMsg = ''
          if (error.response.data.password && error.response.data.password[0]) {
            errorMsg = error.response.data.password[0]
          } else if (error.response.data.email && error.response.data.email[0]) {
            errorMsg = error.response.data.email[0]
          }
          this.setState({
            loadsave: false,
            loginError: true,
            errorMsg: errorMsg
          })
        })
    }
  }

  loadFB () {
    window.fbAsyncInit = function () {
      FB.init({
        appId      : '1021816071285498',
        xfbml      : true,
        version    : 'v2.9'
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
    cookies.set('redirect', redirect, { path: '/', maxAge: 60 })
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
    cookies.set('redirect', redirect, { path: '/', maxAge: 60 })
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
    console.log('finalize')
    let { dispatch } = this.props
    this.props.auth.token && dispatch(getProfile(this.props.auth.token)).then((result) => {
      let cookieRedirect = cookies.get('redirect', { path: '/', maxAge: 60 })
      console.log(cookieRedirect)
      let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null

      if (cookieRedirect !== undefined) {
        redirect = cookieRedirect
      }

      cookies.remove('redirect', redirect, { path: '/', maxAge: 60 })

      Promise.all([
        dispatch(getAllOccupations()),
        dispatch(getMyOccupations()),
        dispatch(getAllSkills()),
        dispatch(getMySkills()),
        dispatch(getAllQuestions()),
      ]).catch((error) => {
        console.log(error)
        this.setState({
          loadsave: false
        })
      }).then(() => {
        if (redirect === 'undefined') {
          redirect = '/'
        }
        if (redirect) {
          this.props.router.push('/signup?redirect=' + redirect)
        } else {
          this.props.router.push('/signup')
        }
      })
    })
  }

  gotoLogin (e) {
    e.preventDefault()
    if (redirect) {
      this.props.router.push('/login?redirect=' + redirect)
    } else {
      this.props.router.push('/login')
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
                <h4 className='text-center'>{translate('register.register_apply')}</h4>
                <h3 className='text-center'>{this.state.jobTitle}</h3>
              </Col>
            </Row>
            }
            <Row className='justify-content-center align-items-center'>
              <Col xs={8} sm={6} md={4} lg={4} xl={3}>
                <img src='/img/wap_logga.png' className='img-fluid mx-auto d-block' />
              </Col>
              {!this.state.linkedIn && !this.state.socialLogin &&
              <Col xs={10}>
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
                  {this.state.errorMsg}
                </Alert>
                }
                <AvForm className='w-100 loginForm' onSubmit={this._handleRegister}>
                  <AvGroup>
                    {/*<Label for='email'>{translate('register.email')}</Label>*/}
                    <AvField type='email' name='email' placeholder={translate('register.email')}
                      ref={(input) => { this.email = input }} required
                      validate={{
                        email: { errorMessage: translate('validation.email') }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    {/*<Label for='password'>{translate('register.password')}</Label>*/}
                    <AvField type='password' name='password' placeholder={translate('register.password')}
                      ref={(input) => { this.password = input }} required
                      validate={{
                        minLength: { value: 8, errorMessage: translate('validation.password_length') },
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    {/*<Label for='confirm_password'>{translate('register.confirm_password')}</Label>*/}
                    <AvField type='password' name='confirm_password' placeholder={translate('register.confirm_password')}
                      ref={(input) => { this.password = input }} required
                      validate={{
                        match:{ value:'password', errorMessage: translate('validation.password_match') },
                      }}
                    />
                  </AvGroup>
                  <ThreeDButton type='submit' className='w-100' loading={this.state.loadsave}>{translate('register.register')}</ThreeDButton>
                </AvForm>
                <h6 className='text-center mt-2'>Har du redan ett konto? <a href='/login' className='fg-pink' onClick={(e) => this.gotoLogin(e)}>Logga in</a></h6>
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

Register.contextTypes = {
  translate: PropTypes.func
}

export default withRouter(connect((state) => state)(Register))
