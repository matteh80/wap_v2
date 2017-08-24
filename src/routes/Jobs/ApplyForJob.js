import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Cookies from 'universal-cookie'
import $ from 'jquery'
import moment from 'moment'
import { saveJob } from '../../store/actions/jobs'
import './ApplyForJob.scss'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText
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
      job: null,
      fetched: false,
      addToWapStory: true,
      applied: false,
      storyAdded: false
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
          wapstats: {
            employmentCount: this.props.employments.employments ? this.props.employments.employments.length : 0,
            educationCount: this.props.educations.educations ? this.props.educations.educations.length : 0,
            occupationCount: this.props.occupations.userOccupations ? this.props.occupations.userOccupations.length : 0,
            skillCount: this.props.skills.userSkills ? this.props.skills.userSkills.length : 0,
            languageCount: this.props.languages.userLanguages ? this.props.languages.userLanguages.length : 0,
            motivationCount: this.props.motivations.userMotivations ? this.props.motivations.userMotivations.length : 0,
            personalityCount: this.props.personalities.userPersonalities ? this.props.personalities.userPersonalities.length : 0,
            videoCount: this.props.wapfilm.video ? 1 : 0,
            drivinglicenseCount: this.props.drivinglicenses.userLicenses ? this.props.drivinglicenses.userLicenses.length : 0,
            referenceCount: this.props.references.references ? this.props.references.references.length : 0,
            personalitytestCompleted: this.props.talentq && this.props.talentq.completed ? 1 : 0,
            locationCount: this.props.locations.userLocations ? this.props.locations.userLocations.length : 0,
          }
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
    let allSavedJobs = cookies.get(this.props.profile.id + 'job')
    let thisJob = { jaid: jaid, title: $xml.find('item title').text() }

    allSavedJobs = allSavedJobs.filter(item => item.jaid !== jaid)
    cookies.set(this.props.profile.id + 'job', allSavedJobs, { path: '/' })
  }

  applyJob () {
    let { dispatch } = this.props
    let id_token = sessionStorage.getItem('id_token')
    let jobTitle = $xml.find('item title').text()

    // TODO: Remove when done with layout
    this.setState({ applied: true })
    return

    axios.post('https://api.wapcard.se/api/v1/jobs/' + jaid + '/apply',
      { 'title': jobTitle },
      {
        headers: {
          'Authorization': 'Token ' + id_token,
        }
      }
    ).then((response) => {
      console.log(response)

      this.removeJobFromCookies()

      if (this.state.addToWapStory) {
        let story = {
          'recruitment_agency': 'Maxkompetens',
          'company_name': $xml.find('company').text(),
          'position_name': $xml.find('jobpositiontitle').text(),
          'description': $xml.find('descriptiontext').first().text(),
          'start_date': moment().format('YYYY-MM-DD'),
          'comment': '',
          'reference': JSON.stringify({ 'name':'', 'mail':'', 'phone':'' }),
          'contact_person': this.makeContactPerson()
        }

        console.log(story)
        dispatch(actions.addStory(id_token, story)).then((result) => {
          console.log('story added')
          console.log(result)

          let event = {
            address: '',
            comment: '',
            contact_person: this.makeContactPerson(),
            date: moment().format('YYYY-MM-DD'),
            event_type: '4c439942-bc0e-4068-9cbb-5ff56276d9be',
            id: result.data.id
          }

          // dispatch(actions.addStoryEvent(id_token, result.data.id, event)).then((result) => {
          //   console.log(result)
          //   this.setState({
          //     storyAdded: true
          //   })
          // })
        })
      }
      this.setState({ applied: true })
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

  createMarkup ($string) { return { __html: $string } }

  handleEnd () {

  }

  render () {
    return (
      <Container>
        {!this.state.applied &&
        <Row className='flex-column-reverse flex-lg-row'>
          <Col>
            {this.state.fetched &&
            <Card>
              <CardBlock>
                <CardTitle>{$xml.find('item title').text()}</CardTitle>
                <div dangerouslySetInnerHTML={this.createMarkup($xml.find('item description').first().text())} />
                <ThreeDButton block onClick={() => this.applyJob()}>Ansök</ThreeDButton>
              </CardBlock>
            </Card>
            }
          </Col>
          <Col xs={12} lg={5}>
            <SpeechBubble pos='side'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi malesuada convallis eros, sit amet aliquam magna fringilla a.
              Curabitur ullamcorper est eget tellus convallis, eget semper elit condimentum.
              Maecenas ipsum ligula, facilisis id mi eu, posuere pellentesque tellus.
              Aenean sed enim nulla. Mauris tincidunt laoreet sem, non cursus lorem hendrerit sit amet.
              Fusce porttitor scelerisque quam, at pulvinar orci dictum et. Suspendisse posuere blandit ligula in convallis.
              Ut vitae tincidunt tortor. Donec quis scelerisque est, vel ullamcorper felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla facilisi.
            </SpeechBubble>
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
                  <CardTitle className='mt-5'>Din ansökan är skickad! Under tiden du väntar på svar från våra rekryterare kan du uppdatera din profil</CardTitle>
                  <p className='mt-5'>Du bör uppdatera din profil inom 12 timmar för att vara säker på att rekryteraren får se det du vill visa upp.</p>
                  <p>En uppdaterad profil där du även gjort personlighetstest och laddat upp en film ökar dina chanser för att få jobbet markant.</p>
                  {this.state.wapstats &&
                  <Row className='justify-content-center align-content-center mt-5'>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.employmentCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Anställningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.educationCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Utbildningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.occupationCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Befattningar</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.skillCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Kompetenser</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.languageCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Språk</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.drivinglicenseCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Körkort</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.motivationCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Drivkrafter</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.personalityCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Personlighet</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.videoCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Wap film</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.videoCount === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Referenser</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.personalitytestCompleted === 0 ? <i className='fa fa-check-circle undone' />
                        : <i className='fa fa-check-circle' />}<h6>Personlighetstest</h6>
                    </Col>
                    <Col xs='6' sm='4' md='3' lg='2' className='wapStats'>
                      {this.state.wapstats.locationCount === 0 ? <i className='fa fa-check-circle undone' />
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

export default connect((state) => state)(ApplyForJob)

class CountdownOverlay extends React.Component {
  render () {
    return (
      <div className='countdown'>
        <h5>Du dirigeras automatiskt vidare till startsidan om {this.props.count} sekunder.</h5>
      </div>
    )
  }
}
