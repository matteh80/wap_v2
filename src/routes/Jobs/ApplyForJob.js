import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import Cookies from 'universal-cookie'
import $ from 'jquery'
import { saveJob, removeJob } from '../../store/actions/jobs'
import './ApplyForJob.scss'
import { error, warning } from 'react-notification-system-redux'
import ReactGA from 'react-ga'
import _ from 'lodash'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Input
} from 'reactstrap'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import ThreeDButton from '../../components/buttons/ThreeDButton'

let jaid
let xml
let $xml
let cookies

class ApplyForJob extends React.Component {
  constructor (props) {
    super(props)
    cookies = new Cookies()
    let { dispatch } = this.props

    this.state = {
      loadsave: false,
      job: null,
      fetched: false,
      addToWapStory: true,
      applied: false,
      storyAdded: false,
      undone: false,
      employmentAndEducationMissing: false,
      onlyOneEmployment: false,
      onlyOneEducation: false,
      showButton: props.employments.employments.length > 1 && props.educations.educations.length > 1 && props.locations.userLocations.length > 0 && props.skills.userSkills.length > 1 && props.languages.userLanguages.length > 1,
      wapstats: {
        employmentCount: props.employments.employments ? props.employments.employments.length : 0,
        educationCount: props.educations.educations ? props.educations.educations.length : 0,
        occupationCount: props.occupations.userOccupations ? props.occupations.userOccupations.length : 0,
        skillCount: props.skills.userSkills ? props.skills.userSkills.length : 0,
        languageCount: props.languages.userLanguages ? props.languages.userLanguages.length : 0,
        motivationCount: props.motivations.userMotivations ? props.motivations.userMotivations.length : 0,
        personalityCount: props.personalities.userPersonalities ? props.personalities.userPersonalities.length : 0,
        videoCount: props.wapfilm.video ? 1 : 0,
        drivinglicenseCount: props.drivinglicenses.userLicenses ? props.drivinglicenses.userLicenses.length : 0,
        referenceCount: props.references.references ? props.references.references.length : 0,
        personalitytestCompleted: props.talentq && props.talentq.completed ? 1 : 0,
        locationCount: props.locations.userLocations ? props.locations.userLocations.length : 0,
        resumeDone: props.profile.personal_info ? props.profile.personal_info.length > 0 : false
      }
    }

    jaid = props.params.jobid

    axios.get('https://cv-maxkompetens.app.intelliplan.eu/JobAdGlobePages/Feed.aspx?pid=AA31EA47-FDA6-42F3-BD9F-E42186E5A960&version=2&JobAdId=' + jaid, {
      responseType: 'text'
    })
      .then((result) => {
        console.log(result)
        console.log($.parseXML(result.data))
        xml = $.parseXML(result.data)
        $xml = $(xml)

        this.setState({
          job: xml,
          fetched: true,
        })

        let mJob = {
          id: jaid,
          title: $xml.find('title').last().text(),
          pubdate: $xml.find('pubdate').text(),
          description: $xml.find('description').text(),
          type: $xml.find('type').text(),
          servicecategory: $xml.find('servicecategory').text(),
          state: $xml.find('state').text(),
          municipality: $xml.find('municipality').text(),
          company: $xml.find('company').text(),
          contact1name: $xml.find('contact1name').text(),
          contact1email: $xml.find('contact1email').text(),
          contact1phone: $xml.find('contact1phone').text()
        }

        dispatch(saveJob(mJob))
      })

    this.saveJobToCookie = this.saveJobToCookie.bind(this)
    this.removeJobFromCookies = this.removeJobFromCookies.bind(this)
    this.handleIconClick = this.handleIconClick.bind(this)
    this.handleOnlyOne = this.handleOnlyOne.bind(this)
  }

  saveJobToCookie (pid) {
    console.log(pid)
    // cookies.remove(this.props.profile.id+'job', { path: '/', maxAge: 1 });
    let allSavedJobs = cookies.get(pid + 'job') ? cookies.get(pid + 'job') : []
    console.log(allSavedJobs)
    let thisJob = { jaid: jaid, title: $xml.find('item title').text() }

    let mIndex = allSavedJobs.findIndex(allSavedJobs => allSavedJobs.jaid === jaid)

    if (mIndex === -1) {
      allSavedJobs.push(thisJob)
      cookies.remove(pid + 'job', { path: '/' })
      cookies.set(pid + 'job', allSavedJobs, { path: '/' })
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.props.profile.id && newProps.profile.id && this.state.fetched) {
      this.saveJobToCookie(newProps.profile.id)
    }
  }

  handleWapStoryChange () {
    this.setState({
      addToWapStory: !this.state.addToWapStory
    })
  }

  removeJobFromCookies () {
    // let allSavedJobs = cookies.get(this.props.profile.id + 'job')
    let { dispatch } = this.props
    let thisJob = { id: jaid, title: $xml.find('item title').text() }
    dispatch(removeJob(thisJob))
  }

  applyJob () {
    this.setState({
      loadsave: true
    })

    let { dispatch } = this.props
    let { token } = this.props.auth
    let jobTitle = $xml.find('item title').text()

    ReactGA.event({
      category: 'Job application',
      action: 'Applied for job',
      label: jobTitle,
      value: Number(jaid)
    })

    // TODO: Remove when done with layout
    // this.setState({ applied: true })
    // this.removeJobFromCookies()

    axios.post('https://api.wapcard.se/api/v1/jobs/' + jaid + '/apply',
      { 'title': jobTitle },
      {
        headers: {
          'Authorization': 'Token ' + token,
        }
      }
    ).then((response) => {
      console.log(response)

      this.removeJobFromCookies()

      // if (this.state.addToWapStory) {
      //   let story = {
      //     'recruitment_agency': 'Maxkompetens',
      //     'company_name': $xml.find('company').text(),
      //     'position_name': $xml.find('jobpositiontitle').text(),
      //     'description': $xml.find('descriptiontext').first().text(),
      //     'start_date': moment().format('YYYY-MM-DD'),
      //     'comment': '',
      //     'reference': JSON.stringify({ 'name':'', 'mail':'', 'phone':'' }),
      //     'contact_person': this.makeContactPerson()
      //   }
      //
      //   console.log(story)
      //   dispatch(actions.addStory(id_token, story)).then((result) => {
      //     console.log('story added')
      //     console.log(result)
      //
      //     let event = {
      //       address: '',
      //       comment: '',
      //       contact_person: this.makeContactPerson(),
      //       date: moment().format('YYYY-MM-DD'),
      //       event_type: '4c439942-bc0e-4068-9cbb-5ff56276d9be',
      //       id: result.data.id
      //     }
      //
      //     // dispatch(actions.addStoryEvent(id_token, result.data.id, event)).then((result) => {
      //     //   console.log(result)
      //     //   this.setState({
      //     //     storyAdded: true
      //     //   })
      //     // })
      //   })
      // }
      this.setState({
        loadsave: false
      })
      if (response.data.status === 'already applied') {
        console.log('LREADY APPLIED')
        dispatch(warning({
          // uid: 'no-network', // you can specify your own uid if required
          title: 'Redan ansökt',
          message: 'Du har redan skickat en ansökan för den här tjänsten!',
          autoDismiss: 20,
          position: 'br',
        }))
      } else if (response.data.status === 'ok') {
        this.setState({ applied: true })
      } else {
        // dispatch(error({
        //   // uid: 'no-network', // you can specify your own uid if required
        //   title: 'Fel',
        //   message: 'Något gick fel när du skickade ansökan. Ladda om sidan och försök igen.',
        //   autoDismiss: 20,
        //   position: 'br',
        // }))
        dispatch(warning({
          // uid: 'no-network', // you can specify your own uid if required
          title: 'Redan ansökt',
          message: 'Du har redan skickat en ansökan för den här tjänsten!',
          autoDismiss: 20,
          position: 'br',
        }))
      }
    })
      .catch((err) => {
        console.log(err.response)
        dispatch(error({
          // uid: 'no-network', // you can specify your own uid if required
          title: 'Fel',
          message: err.response.data.detail,
          autoDismiss: 20,
          position: 'br',
        }))
        this.setState({
          loadsave: false
        })
      })
  }

  makeContactPerson () {
    let contactPerson = {
      name: $xml.find('contact1name').text(),
      mail: $xml.find('contact1email').text(),
      phone: $xml.find('contact1phone').text(),
    }
    return JSON.stringify(contactPerson)
  }

  createMarkup ($string) { return { __html: $string.replace(/(?:\r\n|\r|\n)/g, '<br />') } }

  handleEnd () {

  }

  componentDidMount () {
    if (Object.values(this.state.wapstats).indexOf(0) > -1) {
      this.setState({ undone: true })
    }
  }

  handleIconClick (link) {
    this.props.router.push(link)
  }

  handleOnlyOne (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  componentWillUpdate (newProps, newState) {
    let show = false
    let { wapstats } = newState
    if (wapstats.employmentCount < 2 || wapstats.educationCount < 2) {
      if (this.state.wapstats.employmentCount < 2) {
        if (newState.onlyOneEmployment) {
          show = true
        } else {
          show = false
        }
        if (this.state.wapstats.educationCount < 2 && newState.onlyOneEducation && show) {
          show = true
        } else if (this.state.wapstats.educationCount < 2 && !newState.onlyOneEducation) {
          show = false
        }
      }
      if (this.state.wapstats.educationCount < 2) {
        if (newState.onlyOneEducation) {
          show = true
        } else {
          show = false
        }
        if (this.state.wapstats.employmentCount < 2 && newState.onlyOneEmployment && show) {
          show = true
        } else if (this.state.wapstats.employmentCount < 2 && !newState.onlyOneEmployment) {
          show = false
        }
      }

      if (this.state.onlyOneEmployment !== newState.onlyOneEmployment) {
        if (wapstats.locationCount > 0 && wapstats.skillCount > 1 && wapstats.languageCount > 1 && wapstats.resumeDone) {
          this.setState({
            showButton: show
          })
        }
      }
      if (this.state.onlyOneEducation !== newState.onlyOneEducation) {
        if (wapstats.locationCount > 0 && wapstats.skillCount > 1 && wapstats.languageCount > 1 && wapstats.resumeDone) {
          this.setState({
            showButton: show
          })
        }
      }
    }
  }

  render () {
    let { translate } = this.props

    return (
      <Container>
        {!this.state.applied &&
        <Row className='flex-lg-row-reverse'>
          <SpeechBubble pos='side' xs={12}>
            <h3>Sök jobb med wap</h3>
            <p>Sök det här jobbet direkt med din wap-profil, du slipper skicka in CV eller personligt brev.</p>
            <p>Se till att du har en uppdaterad profil och tryck på knappen "Ansök", svårare än så är det inte!</p>
            <p>Du hittar alltid tillbaka till den här tjänsten under <em>jobb</em> och <em>visade tjänster</em> om du väljer att uppdatera din profil innan du skickar iväg din ansökan.</p>
          </SpeechBubble>
          <Col xs={12}>
            {this.state.fetched &&
            <Card>
              {$xml.find('item title').text() &&
              <CardBlock>
                <Row>
                  <Col xs={12} md={8}>
                    <CardTitle>{$xml.find('item title').text()}</CardTitle>
                  </Col>
                  <Col xs={12} md={4}>
                    <img src={$xml.find('item intelliplan\\:companylogourl').text()} className='pull-right' />
                  </Col>
                </Row>
                <div dangerouslySetInnerHTML={this.createMarkup($xml.find('item description').first().text())} />
                {!this.state.undone && <ThreeDButton block loading={this.state.loadsave} onClick={() => this.applyJob()}>Ansök</ThreeDButton>}
              </CardBlock>
              }
              {!$xml.find('item title').text() &&
              <CardBlock>
                <CardTitle>Hittade ingen tjänst med id {jaid}</CardTitle>
              </CardBlock>
              }
            </Card>
            }
            {this.state.fetched && this.state.undone &&
            <Card>
              <CardBlock>
                <CardTitle className='fg-red'>Din profil är ofullständing</CardTitle>
                <CardSubtitle>
                  För att skicka in din ansökan behöver du minst ha fyllt i de obligatoriska uppgifterna. (Siffran inom parentes visar lägst antal ifyllda uppgifter under varje kategori).
                  Vi rekommenderar att du kompletterar din profil med så mycket information som möjligt för att öka dina chanser att gå vidare i urvalet.
                </CardSubtitle>
                <Row className='justify-content-center align-content-center mt-5'>
                  <Col xs={12}>
                    <h5>Obligatoriskt</h5>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/employments')}>
                    {this.state.wapstats.employmentCount < 2 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Anställningar (2st)</h6>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/educations')}>
                    {this.state.wapstats.educationCount < 2 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Utbildningar (2st)</h6>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/passion/location')}>
                    {this.state.wapstats.locationCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Arbetsorter</h6>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/skills')}>
                    {this.state.wapstats.skillCount < 2 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Kompetenser (2st)</h6>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/languages')}>
                    {this.state.wapstats.languageCount < 2 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Språk (2st)</h6>
                  </Col>

                </Row>
                <Row className='justify-content-center align-content-center mt-5'>
                  <Col xs={12}>
                    <h5>Ej obligatoriskt men rekommenderat</h5>
                  </Col>
                  <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/profile')}>
                    {!this.state.wapstats.resumeDone ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Resumé</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/work/drivinglicenses')}>
                    {this.state.wapstats.drivinglicenseCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Körkort</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/passion/motivations')}>
                    {this.state.wapstats.motivationCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Drivkrafter</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/passion/personalities')}>
                    {this.state.wapstats.personalityCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Personlighet</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/wapfilm')}>
                    {this.state.wapstats.videoCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Wap film</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/work/references')}>
                    {this.state.wapstats.referenceCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Referenser</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/personalitytest')}>
                    {this.state.wapstats.personalitytestCompleted === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Personlighetstest</h6>
                  </Col>
                  <Col className='wapStats' onClick={() => this.handleIconClick('/work/occupations')}>
                    {this.state.wapstats.occupationCount === 0 ? <i className='fa fa-times undone' />
                      : <i className='fa fa-check-circle' />}<h6>Befattningar</h6>
                  </Col>
                </Row>
                <Row className='mt-4'>
                  <Col xs={12}>
                    {this.state.undone && this.state.wapstats.employmentCount < 2 &&
                      <div>
                        <Input type='checkbox' name='onlyOneEmployment' onChange={this.handleOnlyOne} /> Jag har bara en anställning
                      </div>
                    }
                  </Col>
                  <Col xs={12} className='mt-2'>
                    {this.state.undone && this.state.wapstats.educationCount < 2 &&
                    <div>
                      <Input type='checkbox' name='onlyOneEducation' onChange={this.handleOnlyOne} /> Jag har bara en utbildning
                    </div>
                    }
                  </Col>
                  <Col xs={12}>
                    {this.state.showButton &&
                    <ThreeDButton loading={this.state.loadsave} onClick={() => this.applyJob()}>Skicka ansökan</ThreeDButton>
                    }
                  </Col>
                </Row>
              </CardBlock>
            </Card>
            }
          </Col>
        </Row>
        }
        {this.state.applied &&
          <Row>
            <Col xs='12' className='text-center'>
              <Card>
                <CardBlock>
                  <Row className='justify-content-center align-items-center'>
                    <Col xs='12' sm='10' md='9' lg='8' xl='8'>
                      <img src='/img/ansokan_skickad.png' className='img-fluid' />
                    </Col>
                  </Row>
                  <CardTitle className='mt-5'>{translate('jobs.applied_title')}</CardTitle>
                  <CardSubtitle>{translate('jobs.applied')}</CardSubtitle>
                  {this.state.wapstats &&
                  <Row className='justify-content-center align-content-center mt-5'>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/employments')}>
                      {this.state.wapstats.employmentCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Anställningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/educations')}>
                      {this.state.wapstats.educationCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Utbildningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/occupations')}>
                      {this.state.wapstats.occupationCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Befattningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/skills')}>
                      {this.state.wapstats.skillCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Kompetenser</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/languages')}>
                      {this.state.wapstats.languageCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Språk</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/drivinglicenses')}>
                      {this.state.wapstats.drivinglicenseCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Körkort</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/passion/motivations')}>
                      {this.state.wapstats.motivationCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Drivkrafter</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/passion/personalities')}>
                      {this.state.wapstats.personalityCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Personlighet</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/wapfilm')}>
                      {this.state.wapstats.videoCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Wap film</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/work/references')}>
                      {this.state.wapstats.referenceCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Referenser</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/personalitytest')}>
                      {this.state.wapstats.personalitytestCompleted === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Personlighetstest</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats' onClick={() => this.handleIconClick('/passion/location')}>
                      {this.state.wapstats.locationCount === 0 ? <i className='fa fa-times undone' />
                        : <i className='fa fa-check-circle' />}<h6>Arbetsorter</h6>
                    </Col>
                  </Row>
                  }
                </CardBlock>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(ApplyForJob))

class CountdownOverlay extends React.Component {
  render () {
    return (
      <div className='countdown'>
        <h5>Du dirigeras automatiskt vidare till startsidan om {this.props.count} sekunder.</h5>
      </div>
    )
  }
}
