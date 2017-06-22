import React from 'react'
import { connect } from 'react-redux'
import './CVBuilder.scss'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Masonry from 'react-masonry-component'
import $ from 'jquery'

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBlock,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Template1 from './Templates/Template1/Template1'

class CVBuilder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false,
      employments: Object.assign([], this.props.employments.employments),
      educations: Object.assign([], this.props.educations.educations),
      skills: Object.assign([], this.props.skills.userSkills),
      languages: Object.assign([], this.props.languages.userLanguages)
    }

    this.createPdf = this.createPdf.bind(this)
    this.onEmploymentChange = this.onEmploymentChange.bind(this)
    this.onEducationChange = this.onEducationChange.bind(this)
    this.onSkillChange = this.onSkillChange.bind(this)
    this.onLanguageChange = this.onLanguageChange.bind(this)
  }

  createPdf () {
    let promises = []
    let images = new Array($('.A4').length)
    let { profile } = this.props
    let
      $content = $('#hiddenCV'),
      $body = $('body'),
      cacheWidth = $content.width(),
      a4 = [595.28, 841.89]  // for a4 size paper width and height

    $body.css('overflow', 'visible')
    $content.appendTo('body')

    $content.css('visibility', 'visible')
    $body.scrollTop(0)

    function getCanvas () {
      $content.width((a4[0] * 1.33333)).css('max-width', 'none')
      let doc = new jsPDF({
        unit: 'px',
        format: 'a4'
      })

      $.each($('.A4'), function (index, elem) {
        console.log(index)
        let promise = new Promise((resolve, reject) => {
          return html2canvas($(this), {
            imageTimeout: 2000,
            onrendered: function (canvas) {
              let img = canvas.toDataURL('image/jpg')
              images[index] = img
              // doc.setPage((index + 1))
              // doc.addPage()
              // doc.addImage(img, 'JPEG', 0, 0)
              // console.log('addedImage ' + (index + 1))
              resolve('Valid')
              console.log('Valid')
            }
          })
            .catch(err => {
              reject(err)
            })
        })
        promises.push(promise)
      })

      Promise.all(promises).then((result) => {
        images.forEach((image, index) => {
          if (index > 0) {
            doc.addPage()
            doc.setPage((index + 1))
          }
          doc.addImage(image, 'JPEG', 0, 0)
        })
        doc.save('cv_' + profile.first_name + '_' + profile.last_name + '.pdf')
        $body.css('overflow-x', 'hidden')
        $content.appendTo('#cvWrapper')
      })
    }

    getCanvas()
  }

  onLanguageChange (e, item) {
    let array = this.state.languages
    let index = this.state.languages.findIndex(languages => languages.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }
    array.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.setState({
      languages: array
    })
  }

  onSkillChange (e, item) {
    let array = this.state.skills
    let index = this.state.skills.findIndex(skills => skills.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }
    array.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.setState({
      skills: array
    })
  }

  onEducationChange (e, item) {
    let array = this.state.educations
    let index = this.state.educations.findIndex(educations => educations.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }
    array.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.setState({
      educations: array
    })
  }

  onEmploymentChange (e, item) {
    let array = this.state.employments
    let index = this.state.employments.findIndex(employments => employments.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }
    array.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.setState({
      employments: array
    })
  }

  render () {
    let {
      employments,
      educations,
      skills,
      languages,
    } = this.props

    return (
      <Container fluid className='cvBuilder'>
        <Masonry
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <Col xs={12} md={6} lg={4}>
            <Card>
              <CardHeader>Anställningar</CardHeader>
              <CardBlock>
                {employments.employments && employments.employments.map((employment) => {
                  return <CheckboxItem item={employment} label={employment.title + ' / ' + employment.employer} onChange={this.onEmploymentChange} />
                })}
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <CardHeader>Utbildningar</CardHeader>
              <CardBlock>
                {educations.educations && educations.educations.map((education) => {
                  return <CheckboxItem item={education} label={education.orientation + ' / ' + education.school} onChange={this.onEducationChange} />
                })}
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <CardHeader>Kompetenser</CardHeader>
              <CardBlock>
                {skills.userSkills && skills.userSkills.map((skill) => {
                  return <CheckboxItem item={skill} label={skill.name + ' / ' + skill.experience} onChange={this.onSkillChange} />
                })}
              </CardBlock>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card>
              <CardHeader>Språk</CardHeader>
              <CardBlock>
                {languages.userLanguages && languages.userLanguages.map((language) => {
                  return <CheckboxItem item={language} label={language.name} onChange={this.onLanguageChange} />
                })}
              </CardBlock>
            </Card>
          </Col>

        </Masonry>
        <ThreeDButton onClick={() => this.createPdf()} text='Skapa PDF' loading={this.state.loadsave} />
        <Template1
          employments={this.state.employments}
          educations={this.state.educations}
          skills={this.state.skills}
          languages={this.state.languages}
          drivinglicenses={this.props.drivinglicenses.userLicenses}
          profile={this.props.profile}
        />
      </Container>
    )
  }
}

export default connect((state) => state)(CVBuilder)

class CheckboxItem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <FormGroup check>
        <Label check>
          <Input type='checkbox' defaultChecked onChange={(e) => this.props.onChange(e, this.props.item)} />{' '}
          {this.props.label}
        </Label>
      </FormGroup>
    )
  }
}
