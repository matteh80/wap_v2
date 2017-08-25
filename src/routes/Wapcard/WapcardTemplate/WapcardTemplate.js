import React from 'react'
import './WapcardTemplate.scss'
import ProfilePicture from '../../../components/Misc/ProfilePicture/ProfilePicture'
import $ from 'jquery'
import 'jquery-circle-progress'

import {
  Col,
  Row,
  Progress
} from 'reactstrap'
import DotProgress from '../../../components/Misc/DotProgress/DotProgress';

class WapcardTemplate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      picSet: false
    }

    this.getAvailabilityString = this.getAvailabilityString.bind(this)
    this.isPictureSet = this.isPictureSet.bind(this)
  }

  componentDidMount () {
    $('.skillCircle').each(function (e, i) {
      let mValue = $(this).attr('data-value') / 5
      $(this).circleProgress({
        value: mValue,
        size: 100,
        fill: {
          gradient: ['#248fb8', '#27b89e']
        },
        animation: false
      })
    })
  }

  getAvailabilityString () {
    switch (this.props.profile.availability) {
      case 0:
        return 'Omgående'
      case 1:
        return '1 månad'
      case 2:
        return '2 månader'
      case 3:
        return '3 månader'
      case 4:
        return ' över 3 månader'
    }
  }

  _getStartEndDate (startDate, endDate, current) {
    let moment = require('moment')
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' - Nuvarande anställning'
    } else {
      return moment(startDate).format('MMM YYYY') + ' - ' + moment(endDate).format('MMM YYYY')
    }
  }

  isPictureSet (set) {
    this.props.isPictureSet(set)
  }

  render () {
    let { personalities, motivations, languages, profile, employments, educations, skills } = this.props

    let userskillsList = Object.assign([], skills)
    userskillsList && userskillsList.sort(function (a, b) {
      return a.experience < b.experience
    })
    userskillsList.length = 6

    return (
      <Row className='wapcardTemplateWrapper'>
        <Col xs={3} className='leftCol'>
          <Row>
            <ProfilePicture canvas isSet={this.isPictureSet} />
          </Row>
          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Personlighet
              </h4>
              {personalities && personalities.map((personality) => {
                return <Row key={personality.id}><Col>{personality.name}</Col></Row>
              })}
            </Col>
          </Row>
          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Drivkrafter
              </h4>
              {motivations && motivations.map((motivation) => {
                return <Row key={motivation.id}><Col>{motivation.name}</Col></Row>
              })}
            </Col>
          </Row>
          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Språk
              </h4>
              {languages && languages.map((language) => {
                return <Row key={language.id}>
                  <Col xs={12}>{language.name}</Col>
                  <Col><Progress color='warning' min={0} max={5} value={(language.spoken + language.written) / 2} /></Col>
                </Row>
              })}
            </Col>
          </Row>
          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Tillgänglighet
              </h4>
              {this.getAvailabilityString()}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className='p-5' style={{ position: 'absolute', bottom: 0 }}>
              <img src='/img/wap_logo_bee_wap_black.png' className='img-fluid' />
            </Col>
          </Row>
        </Col>
        <Col xs={9} className='rightCol'>
          <div className='profileInfo' style={{ height: 204 }}>
            <Row className='pt-4'>
              <Col xs={12}>
                <h2 className='mb-0'>{profile.first_name}{' '}{profile.last_name}</h2>
                <h3>{profile.title}</h3>
              </Col>
              <Col xs={12} className='mt-1'><i className='fa fa-phone' /> {profile.mobile_phone_number}</Col>
              <Col xs={12}><i className='fa fa-envelope' /> {profile.email}</Col>
              {profile.home_page && <Col xs={12}><i className='fa fa-globe' /> {profile.home_page}</Col>}
              <Col xs={12}><i className='fa fa-map-marker' /> {profile.city}</Col>
            </Row>
          </div>

          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Anställningar
              </h4>
              {employments && employments.map((employment) => {
                if (employment.public === true) {
                  return (
                    <Row key={employment.id} className='timeline-item'>
                      <Col className='mb-3'>
                        <div className='mb-2 startEndDate'><span>{this._getStartEndDate(employment.start_date, employment.end_date, employment.current)}</span></div>
                        <h5>{employment.title} | {employment.employer}</h5>
                        <p style={{ fontSize: 12, lineHeight: 1.1 }}>{employment.description}</p>
                      </Col>
                    </Row>
                  )
                }
              })}
            </Col>
          </Row>

          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Kompetenser
              </h4>
              <Row>
                {userskillsList && userskillsList.map((skill, index) => {
                  return (
                    <Col xs={6} key={skill.id}>
                      <DotProgress num={skill.experience} title={skill.name} />
                      {/* <CircularProgressbar percentage={60} /> */}
                    </Col>
                  )
                })}
              </Row>
            </Col>
          </Row>

          <Row className='wpSection mt-4'>
            <Col xs={12}>
              <h4 className='sectionHeader'>
                Utbildningar
              </h4>
              {educations && educations.map((education) => {
                if (education.public === true) {
                  return <Row key={education.id} className='timeline-item'>
                    <Col className='mb-3'>
                      <div className='mb-2 startEndDate'><span>{this._getStartEndDate(education.start_date, education.end_date, false)}</span></div>
                      <h5>{education.school} | {education.orientation}</h5>
                      <p style={{ fontSize: 12, lineHeight: 1.1 }}>{education.description}</p>
                    </Col>
                  </Row>
                }
              })}
            </Col>
          </Row>

        </Col>
      </Row>
    )
  }
}

export default WapcardTemplate
