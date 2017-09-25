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
import _ from 'lodash'

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
import Template2 from './Templates/Template2/Template2'

class CVBuilder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false,
      employments: Object.assign([], this.props.employments.employments),
      educations: Object.assign([], this.props.educations.educations),
      skills: Object.assign([], this.props.skills.userSkills),
      languages: Object.assign([], this.props.languages.userLanguages),
      drivinglicenses: Object.assign([], this.props.drivinglicenses.userLicenses),
      references: Object.assign([], this.props.references.references),
      resume: true,
      createPdf: false,
      createPreview: false,
      showTemplate: false,
      showUpdatePreview: false,
      images: [],
      selectedTemplate: 'template2'
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
    this.onLicenseChange = this.onLicenseChange.bind(this)
    this.onReferenceChange = this.onReferenceChange.bind(this)
    this.onResumeChange = this.onResumeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getTemplate = this.getTemplate.bind(this)
    this.changeTemplate = this.changeTemplate.bind(this)
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

    if (prevState.selectedTemplate !== this.state.selectedTemplate) {
      this.preparePreview()
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
              images[index] = canvas.toDataURL('image/png', 1.0)
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
          doc.addImage(image, 'PNG', 0, 0)
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

  onLicenseChange (e, item) {
    let array = this.state.drivinglicenses
    let index = this.state.drivinglicenses.findIndex(drivinglicenses => drivinglicenses.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }

    this.setState({
      drivinglicenses: array,
      showUpdatePreview: true
    })
  }

  onReferenceChange (e, item) {
    let array = this.state.references
    let index = this.state.references.findIndex(references => references.id === item.id)

    if (index > -1) {
      array.splice(index, 1)
    } else {
      array.push(item)
    }

    this.setState({
      references: array,
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
        image.src = canvas.toDataURL('image/jpg')
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

  changeTemplate () {
    this.setState({
      selectedTemplate: 'template2',
      showUpdatePreview: true
    })
  }

  getTemplate () {
    console.log('get template')
    let template = _.find(templates, { name: this.state.selectedTemplate })
    if (template) {
      let mTemplate = React.cloneElement(
        template.component,
        {
          employments: this.state.employments,
          educations: this.state.educations,
          skills: this.state.skills,
          languages: this.state.languages,
          drivinglicenses:this.state.drivinglicenses,
          profile: this.props.profile,
          references: this.state.references,
          resume: this.props.profile.personal_info ? this.state.resume : false
        }
      )
      return mTemplate
    }
  }

  render () {
    let {
      employments,
      educations,
      skills,
      languages,
      drivinglicenses,
      references
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
          <SpeechBubble hideable xs={12}>
            <CardTitle>Här skapar du ett CV</CardTitle>
            <p>Genom att bocka i/ur dina erfarenheter och kompetenser skräddarsyr du enkelt ditt CV och kan på så sätt välja hur du vill presentera dig själv från gång till gång.</p>
          </SpeechBubble>
        </Row>
        <Row className='mb-4'>
          <Col xs={12}>
            <h5>1. Välj designmall</h5>
          </Col>
          <Col xs={12}>
            <button className={classNames('btn', this.state.selectedTemplate === 'template2' && 'btn-info')} onClick={() => this.setState({ selectedTemplate: 'template2', showUpdatePreview: true })}>Mall 1</button>
            <button className={classNames('ml-1 btn', this.state.selectedTemplate === 'template1' && 'btn-info')} onClick={() => this.setState({ selectedTemplate: 'template1', showUpdatePreview: true })}>Mall 2</button>
          </Col>
        </Row>

        <Row className='mb-2'>
          <Col xs={12}>
            <h5>2. Välj vilken information du vill ha med i ditt CV</h5>
          </Col>
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
                    <CardTitle>Anställningar</CardTitle>
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
                  <CardHeader><CardTitle>Utbildningar</CardTitle></CardHeader>
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
                  <CardHeader><CardTitle>Kompetenser</CardTitle></CardHeader>
                  <CardBlock>
                    {skills.userSkills && skills.userSkills.map((skill) => {
                      return <CheckboxItem key={skill.id} item={skill} label={skill.name + ' / ' + skill.experience} onChange={this.onSkillChange} />
                    })}
                    {skills.userSkills.length === 0 &&
                    <div>
                      <h6>Du har inte lagt till några kompetenser.</h6>
                    </div>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader><CardTitle>Språk</CardTitle></CardHeader>
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
                  <CardHeader><CardTitle>Körkort</CardTitle></CardHeader>
                  <CardBlock>
                    {drivinglicenses && drivinglicenses.userLicenses && drivinglicenses.userLicenses.map((license) => {
                      return <CheckboxItem key={license.id} item={license} label={license.name} onChange={this.onLicenseChange} />
                    })}
                    {drivinglicenses && drivinglicenses.userLicenses.length === 0 &&
                    <h6>Du har inte lagt till några körkort ännu.</h6>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader><CardTitle>Referenser</CardTitle></CardHeader>
                  <CardBlock>
                    {references.references && references.references.map((reference) => {
                      return <CheckboxItem key={reference.id} item={reference} label={reference.name} onChange={this.onReferenceChange} />
                    })}
                    {drivinglicenses.userLicenses.length === 0 &&
                    <h6>Du har inte lagt till några körkort ännu.</h6>}
                  </CardBlock>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={4} xl={3}>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumé</CardTitle>
                  </CardHeader>
                  <CardBlock>
                    {this.props.profile.personal_info &&
                    <CheckboxItem label='Min resumé' checked={this.state.resume}
                      onChange={this.onResumeChange} />}
                    {!this.props.profile.personal_info &&
                    <h6>Gå till din profil och skriv lite kortfattat om dig själv</h6>}
                  </CardBlock>
                </Card>
              </Col>
            </Masonry>
            <Row>
              <Col xs={12}>
                <h5 className='mb-1'>3. Skapa och ladda ner ditt CV</h5>
              </Col>
              <Col xs={12}>
                <ThreeDButton onClick={() => this.preparePdf()} text='Skapa PDF' loading={this.state.createPdf} className='mb-5' />
              </Col>
            </Row>

            {this.state.showTemplate && this.getTemplate()}

             {/*<Template2*/}
             {/*employments={this.state.employments}*/}
             {/*educations={this.state.educations}*/}
             {/*skills={this.state.skills}*/}
             {/*languages={this.state.languages}*/}
             {/*drivinglicenses={this.state.drivinglicenses}*/}
             {/*profile={this.props.profile}*/}
             {/*references={this.state.references}*/}
             {/*resume={this.props.profile.personal_info ? this.state.resume : false}*/}
             {/*/>*/}

          </Col>
        </Row>
      </Container>
    )
  }
}

const templates = [
  { component: <Template1 />, name: 'template1' },
  { component: <Template2 />, name: 'template2' }
]

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
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.65)', zIndex: 9, display: 'flex' }}
        className='justify-content-center align-items-center flex-column'
      >
        <i className={mClassses} style={{ fontSize: 50 }} onClick={() => this.props.refresh()} />
        {this.props.creating
          ? <h6>Skapar förhandsgranskning...</h6>
          : <h6>Klicka för att uppdatera</h6>
        }
      </div>
    )
  }
}
