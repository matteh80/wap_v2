import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Cookies from 'universal-cookie'
import $ from 'jquery'
import moment from 'moment'
import { saveJob } from '../../store/actions/jobs'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle
} from 'reactstrap'

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

    jaid = this.props.params.jobid

    console.log(jaid)

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
          fetched: true
        })

        let mJob = {
          id: $xml.find('id').text(),
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

  render () {
    return (
      <Container>
        <Row>
          <Col>
            {this.state.fetched &&
            <Card>
              <CardBlock>
                <CardTitle>{$xml.find('item title').text()}</CardTitle>
                <div dangerouslySetInnerHTML={this.createMarkup($xml.find('item description').first().text())} />
              </CardBlock>
            </Card>
            }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(ApplyForJob)
