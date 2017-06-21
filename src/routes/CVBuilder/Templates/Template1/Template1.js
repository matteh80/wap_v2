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

let originalChildren = []

class Template1 extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      numPages: 0
    }

    this.snipMe = this.snipMe.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    let _self = this
    $('.A4').not(':first').remove()
    $('.A4').append(originalChildren)
    $('.A4').each(function (index, elem) {
      _self.snipMe($(this))
    })
  }

  componentDidMount () {
    originalChildren = $('.A4').first().children().toArray()
    let _self = this

    $('.A4').each(function (index, elem) {
      console.log(index)
      _self.snipMe($(this))
    })
  }

  snipMe (elem) {
    // let totalHeight = 0
    let long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    // elem.children().each(function () {
    //   totalHeight = totalHeight + $(this).outerHeight(true)
    // })
    // console.log('totalHeight: ' + totalHeight)
    // let long = totalHeight - Math.ceil(elem.innerHeight())
    // console.log('long: ' + long)
    let children = elem.children().toArray()
    let removed = []
    while (long > 0 && children.length > 0) {
      let child = children.pop()
      $(child).detach()
      removed.unshift(child)
      // totalHeight = 0
      // elem.children().each(function () {
      //   totalHeight = totalHeight + $(this).outerHeight(true)
      // })
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
      // console.log('totalHeight: ' + totalHeight)
      // long = totalHeight - Math.ceil(elem.innerHeight())
    }
    if (removed.length > 0) {
      let a4 = $('<div class="A4 templateWrapper container-fluid"></div>')
      a4.append(removed)
      elem.after(a4)
      this.snipMe(a4)
    }
  }

  render () {
    return (
      <div id='hiddenCV'>
        <Container fluid className='templateWrapper A4'>
          <HeaderSection profile={this.props.profile} />
          <EmploymentSection employments={this.props.employments} />
          <EducationSection educations={this.props.educations} />
          <SkillSection skills={this.props.skills} />
          <LanguageSection languages={this.props.languages} />
        </Container>
      </div>
    )
  }
}

export default Template1
