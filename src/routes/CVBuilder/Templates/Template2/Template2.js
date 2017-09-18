import React from 'react'
import '../Templates.scss'
import './Template2.scss'
import $ from 'jquery'
import {
  Row,
  Col,
  Container,
} from 'reactstrap'

import EmploymentSection from './components/EmploymentSection'
import EducationSection from './components/EducationSection'
import SkillSection from './components/SkillSection'
import LanguageSection from './components/LanguageSection'
import HeaderSection from './components/HeaderSection'
import DrivingLicenseSection from './components/DrivingLicenseSection'
import ResumeSection from './components/ResumeSection'
import ReferenceSection from './components/ReferenceSection'
import InfoSection from './components/InfoSection'

class Template2 extends React.Component {
  constructor (props) {
    super(props)

    this.alignSections = this.alignSections.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    let _self = this

    this.alignSections($('.A4'))
  }

  componentDidMount () {
    this.alignSections($('.A4'))
  }

  alignSections (elem) {
    let long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    let children = elem.find('.main section').toArray()
    console.log(children)
    let removed = []
    while (long > 0 && children.length > 0) {
      let child = children.pop() // Remove last child
      $(child).detach() // ???
      removed.unshift(child)
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    }

    elem.find('.main').append(removed[0])
    let removedOverflow = []
    let overflowChildren = $(removed[0]).children().toArray()
    long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())

    while (long > 0 && overflowChildren.length > 0) {
      let child = overflowChildren.pop() // Remove last child
      console.log(child)
      $(child).detach() // ???
      removedOverflow.unshift(child)
      if (overflowChildren.length === 1) {
        let child = overflowChildren.pop() // Remove last child
        $(child).detach() // ???
        removedOverflow.unshift(child)
      }
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    }

    if (removedOverflow.length > 0) {
      let tobeCloned = removed.shift()
      let clone = $(tobeCloned).clone()
      let contTitle = '...fortsättning ' + $(clone[0]).find('.sectionTitle').text()
      let shouldBeContinue = $(clone[0]).find('.sectionTitle').text()
      console.log(shouldBeContinue)
      clone.empty()
      shouldBeContinue && clone.append('<div class="col-12"><small class="fg-gray text-left"><em>' + contTitle + '</em></small></dla>')
      clone.append(removedOverflow)
      removed.unshift(clone[0])
    }
    if (removed.length > 0) {
      let a4 = $('<div class="A4 templateWrapper p-0 container-fluid template2">' +
        '<div class="row h-100 m-0"><div class="col-1 side">' +
        '<img src="/img/bee_white_all.png" class="img-fluid wapLogo page2" /></div><div class="col-11 main py-5 px-5"></div></div></div>')

      a4.find('.main').append(removed)
      elem.after(a4)
      this.alignSections(a4)
    }
  }

  render () {
    return (
      <div id='cvWrapper'>
        <div id='hiddenCV'>
          <Container fluid className='templateWrapper A4 p-0 template2'>
            <Row className='h-100 m-0'>
              <Col xs={4} className='side'>
                <HeaderSection profile={this.props.profile} />
                <div className='side-content px-2 pt-2'>
                  <InfoSection profile={this.props.profile} />
                  {this.props.skills.length > 0 && <SkillSection skills={this.props.skills} />}
                  {this.props.languages.length > 0 && <LanguageSection languages={this.props.languages} />}
                  <img src='/img/bee_white_all.png' className='img-fluid wapLogo' />
                </div>
              </Col>
              <Col xs={8} className='main py-5 pr-5'>
                {this.props.resume && <ResumeSection profile={this.props.profile} />}
                {this.props.employments.length > 0 && <EmploymentSection employments={this.props.employments} />}

                {this.props.educations.length > 0 && <EducationSection educations={this.props.educations} />}

                {this.props.drivinglicenses.length > 0 && <DrivingLicenseSection drivinglicenses={this.props.drivinglicenses} />}
                {this.props.references.length > 0 && <ReferenceSection references={this.props.references} />}

              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

export default Template2
