import React from 'react'
import '../Templates.scss'
import './Template1.scss'
import $ from 'jquery'
import {
  Container,
} from 'reactstrap'

import EmploymentSection from './components/EmploymentSection'
import EducationSection from './components/EducationSection'
import SkillSection from './components/SkillSection'
import LanguageSection from './components/LanguageSection'
import HeaderSection from './components/HeaderSection'
import DrivingLicenseSection from './components/DrivingLicenseSection'

let originalChildren = []

class Template1 extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      numPages: 0
    }

    this.alignSections = this.alignSections.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    let _self = this
    $('.A4').not(':first').remove()
    $('.A4').append(originalChildren)
    $('.A4').each(function (index, elem) {
      _self.alignSections($(this))
    })
  }

  componentDidMount () {
    originalChildren = $('.A4').first().children().toArray()
    let _self = this

    $('.A4').each(function (index, elem) {
      console.log(index)
      _self.alignSections($(this))
    })
  }

  alignSections (elem) {
    let long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    let children = elem.children().toArray()
    let removed = []
    while (long > 0 && children.length > 0) {
      let child = children.pop()
      $(child).detach()
      removed.unshift(child)
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    }
    if (removed.length > 0) {
      let a4 = $('<div class="A4 templateWrapper container-fluid"></div>')
      a4.append(removed)
      elem.after(a4)
      this.alignSections(a4)
    }
  }

  render () {
    return (
      <div id='cvWrapper'>
        <div id='hiddenCV'>
          <Container fluid className='templateWrapper A4'>
            <HeaderSection profile={this.props.profile} />
            <EmploymentSection employments={this.props.employments} />
            <SkillSection skills={this.props.skills} />
            <EducationSection educations={this.props.educations} />
            <LanguageSection languages={this.props.languages} />
            <DrivingLicenseSection drivinglicenses={this.props.drivinglicenses} />
          </Container>
        </div>
      </div>
    )
  }
}

export default Template1
