import React from 'react'
import './WapcardTemplate.scss'
import ProfilePicture from '../../../components/Misc/ProfilePicture/ProfilePicture'
import CircularProgressbar from 'react-circular-progressbar'
import $ from 'jquery'
import 'jquery-circle-progress'

import {
  Col,
  Row,
  Progress
} from 'reactstrap'

class WapcardTemplate extends React.Component {
  constructor (props) {
    super(props)

    this.getAvailabilityString = this.getAvailabilityString.bind(this)
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

  render () {
    let { personalities, motivations, languages, profile, employments, educations, skills } = this.props

    let userskillsList = Object.assign([], skills)
    userskillsList && userskillsList.sort(function (a, b) {
      return a.experience < b.experience
    })
    userskillsList.length = 3

    return (
      <Row className='wapcardTemplateWrapper'>
        <Col xs={4} className='leftCol'>
          <Row>
            <ProfilePicture canvas />
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
        <Col xs={8} className='rightCol'>
          <div className='profileInfo' style={{ height: 270 }}>
            <Row className='pt-3'>
              <Col xs={12} style={{ paddingTop: 20 }}>
                <h2>{profile.first_name}{' '}{profile.last_name}</h2>
                <h3>{profile.title}</h3>
              </Col>
              <Col xs={12} className='mt-4'><i className='fa fa-phone' /> {profile.mobile_phone_number}</Col>
              <Col xs={12}><i className='fa fa-envelope' /> {profile.email}</Col>
              <Col xs={12}><i className='fa fa-globe' /> {profile.home_page}</Col>
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
                      <Col>
                        <h5 className='mt-2 mb-0'>{employment.title} | {employment.employer}</h5>
                        <small>{employment.start_date}</small>
                        <p>{employment.description}</p>
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
                Topp 3 kompetenser
              </h4>
              <Row>
                {userskillsList && userskillsList.map((skill, index) => {
                  return (
                    <Col xs={4} key={skill.id}>
                      <div className='skillCircle flex-column mt-2' data-value={skill.experience}>
                        <h4 className='percentValue' style={{ color: 'black' }}>{skill.experience / 5 * 100}%</h4>
                        <h5 className='mt-2'>{skill.name}</h5>
                      </div>
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
                    <Col>
                      <h5 className='mt-2'>{education.school}</h5>
                      <h6>{education.orientation}</h6>
                      <p>{education.description}</p>
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
