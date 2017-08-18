import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import './CVBuilder.scss'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Masonry from 'react-masonry-component'
import $ from 'jquery'
import classNames from 'classnames'
import Slider from 'react-slick'

import {
  Container,
  Col,
  Row,
  Card,
  CardHeader,
  CardBlock,
  CardTitle,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import Template1 from './Templates/Template1/Template1'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

class CVBuilder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false,
      employments: Object.assign([], this.props.employments.employments),
      educations: Object.assign([], this.props.educations.educations),
      skills: Object.assign([], this.props.skills.userSkills),
      languages: Object.assign([], this.props.languages.userLanguages),
      resume: true,
      createPdf: false,
      createPreview: false,
      showTemplate: false,
      showUpdatePreview: false,
      images: []
    }

    this.state.employments.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.state.educations.sort(function (a, b) {
      if (a.start_date < b.start_date) return 1
      if (a.start_date > b.start_date) return -1
      return 0
    })

    this.createPdf = this.createPdf.bind(this)
    this.preparePdf = this.preparePdf.bind(this)
    this.preparePreview = this.preparePreview.bind(this)
    this.createCanvas = this.createCanvas.bind(this)
    this.onEmploymentChange = this.onEmploymentChange.bind(this)
    this.onEducationChange = this.onEducationChange.bind(this)
    this.onSkillChange = this.onSkillChange.bind(this)
    this.onLanguageChange = this.onLanguageChange.bind(this)
    this.onResumeChange = this.onResumeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    let _self = this
    if (!prevState.createPdf && this.state.createPdf) {
      setTimeout(function () {
        _self.createPdf()
      }, 1500)
    }

    if (!prevState.createPreview && this.state.createPreview) {
      setTimeout(function () {
        _self.createCanvas()
      }, 1500)
    }
  }

  preparePdf () {
    this.setState({
      createPdf: true,
      showTemplate: true
    })
  }

  preparePreview () {
    this.setState({
      createPreview: true,
      showTemplate: true
    })
  }

  createPdf () {
    let _self = this
    let promises = []
    let images = new Array($('.A4').length)
    let { profile } = this.props
    let
      $content = $('#hiddenCV'),
      $body = $('body'),
      cacheWidth = $content.width(),
      a4 = [595.28, 841.89]  // for a4 size paper width and height

    $body.css('overflow', 'visible')
    // $content.appendTo('body')

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
            imageTimeout: 6000,
            onrendered: function (canvas) {
              images[index] = canvas.toDataURL('image/jpg')
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
        _self.setState({ createPdf: false, showTemplate: false })
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

    this.setState({
      languages: array,
      showUpdatePreview: true
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

    this.setState({
      skills: array,
      showUpdatePreview: true
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
      educations: array,
      showUpdatePreview: true
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
      employments: array,
      showUpdatePreview: true
    })
  }

  onResumeChange () {
    this.setState({
      resume: !this.state.resume,
      showUpdatePreview: true,
    })
  }

  createCanvas () {
    console.log('create canvas')
    let _self = this
    let promises = []
    let images = []

    $.each($('.A4'), function (index, elem) {
      console.log(index)
      let promise = new Promise((resolve, reject) => {
        return html2canvas($(this), {
          imageTimeout: 6000,
          onrendered: function (canvas) {
            images[index] = canvas
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
      let imageArray = []
      images.forEach((canvas, index) => {
        // let carouselItem = $('<div class="carouselItem" />')
        // if (index === 0) {
        //   carouselItem = $('<div class="carousel-item active"></div>')
        // }
        let image = new Image()
        image.src = canvas.toDataURL('image/png')
        imageArray.push(image)
        // $(image).addClass('img-fluid cvPreviewCanvas')
        // carouselItem.append(image)
        // $('.cvPreviewWrapper').append(carouselItem)
      })
      _self.setState({ createPreview: false, showTemplate: false, showUpdatePreview:false, images: imageArray })
    })
  }

  componentDidMount () {
    this.setState({
      createPreview: true,
      showTemplate: true,
      showUpdatePreview: true
    })
  }

  handleClick (e) {
    e.preventDefault()
    this.props.router.push(e.target.href)
  }

  render () {
    let {
      employments,
      educations,
      skills,
      languages,
    } = this.props

    let chevronClass = classNames('fa pull-right', this.state.collapse ? 'fa-chevron-down' : 'fa-chevron-up')

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
    }

    return (
      <Container fluid className='cvBuilder'>
        <Row>
          <Col xs={12}>
            <SpeechBubble>
              <CardTitle>Här skapar du ett CV</CardTitle>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida nibh at nisi accumsan, quis luctus est euismod. Curabitur vel finibus leo. Phasellus maximus enim eget neque posuere aliquet. Aliquam id sem vitae justo semper suscipit. Nulla ullamcorper arcu urna, quis lacinia turpis scelerisque ac. Aliquam interdum nisi eget eros cursus finibus. Mauris tempus velit sem, et rutrum nulla vulputate vel. Maecenas magna nulla, rutrum at molestie eu, efficitur interdum augue.</p>
              <p>Maecenas eu lacus imperdiet, molestie dolor nec, venenatis ipsum. Sed vitae posuere nunc. Cras vestibulum quam et diam viverra vulputate. Mauris a leo lectus. Morbi tempor imperdiet magna, vitae euismod ex imperdiet at. Nam a hendrerit quam. Nam accumsan metus sed turpis hendrerit viverra. </p>
            </SpeechBubble>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Masonry
              className='row'
              ref={function (c) {
                this.masonry = this.masonry || c.masonry
              }.bind(this)}
        >
              <Col xs={12} md={6} lg={4} xl={3}>
                <Card className='preview' style={{ minHeight: 100 }}>
                  {this.state.showUpdatePreview &&
                  <PreviewOverlay refresh={this.preparePreview} creating={this.state.createPreview} />}
                  {this.state.images.length > 0 && <Slider {...settings} autoplay={this.state.images.length > 1}>
                    {this.state.images.map(function (slide, index) {
                      return <div key={index}><img src={slide.src} className='img-fluid' /></div>
                    })}
                  </Slider> }
                  <div className='cvPreviewWrapper' />
                </Card>
              </Col>
              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>
                Anställningar
                {/* <i className={chevronClass} style={{ fontSize: 20 }} /> */}
                  </CardHeader>
                  <CardBlock>
                    {employments.employments && employments.employments.map((employment) => {
                      return <CheckboxItem key={employment.id} item={employment} label={employment.title + ' / ' + employment.employer} onChange={this.onEmploymentChange} />
                    })}
                    {employments.employments.length === 0 &&
                    <h6>Du har inte lagt till några anställningar.</h6>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>Utbildningar</CardHeader>
                  <CardBlock>
                    {educations.educations && educations.educations.map((education) => {
                      return <CheckboxItem key={education.id} item={education} label={education.orientation + ' / ' + education.school} onChange={this.onEducationChange} />
                    })}
                    {educations.educations.length === 0 &&
                    <h6>Du har inte lagt till några utbildningar.</h6>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>Kompetenser</CardHeader>
                  <CardBlock>
                    {skills.userSkills && skills.userSkills.map((skill) => {
                      return <CheckboxItem key={skill.id} item={skill} label={skill.name + ' / ' + skill.experience} onChange={this.onSkillChange} />
                    })}
                    {skills.userSkills.length === 0 &&
                    <div>
                      <h6>Du har inte lagt till några kompetenser.</h6>
                      {/* <a href='/work/skills' className='center' onClick={(e) => this.handleClick(e)}><i className='fa fa-plus-circle' /></a> */}
                    </div>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>Språk</CardHeader>
                  <CardBlock>
                    {languages.userLanguages && languages.userLanguages.map((language) => {
                      return <CheckboxItem key={language.id} item={language} label={language.name} onChange={this.onLanguageChange} />
                    })}
                    {languages.userLanguages.length === 0 &&
                    <h6>Du har inte lagt till några språk ännu.</h6>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>
                Resumé
                {/* <i className={chevronClass} style={{ fontSize: 20 }} /> */}
                  </CardHeader>
                  <CardBlock>
                    {this.props.profile.personal_info &&
                    <CheckboxItem label='Visa resumé / personlig info' checked={this.state.resume}
                      onChange={this.onResumeChange} />}
                    {!this.props.profile.personal_info &&
                    <h6>Gå till din profil och skriv lite kortfattat om dig själv</h6>}
                  </CardBlock>
                </Card>
              </Col>
            </Masonry>
            <ThreeDButton onClick={() => this.preparePdf()} text='Skapa PDF' loading={this.state.createPdf} />
            {this.state.showTemplate && <Template1
              employments={this.state.employments}
              educations={this.state.educations}
              skills={this.state.skills}
              languages={this.state.languages}
              drivinglicenses={this.props.drivinglicenses.userLicenses}
              profile={this.props.profile}
              resume={this.props.profile.personal_info ? this.state.resume : false}
        />}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect((state) => state)(CVBuilder))

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

class PreviewOverlay extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let mClassses = classNames('fa fa-refresh', this.props.creating && 'fa-spin')
    return (
      <div
        style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.65)', zIndex: 9, display: 'flex' }}
        className='justify-content-center align-items-center'
      >
        <i className={mClassses} style={{ fontSize: 50 }} onClick={() => this.props.refresh()} />
      </div>
    )
  }
}
