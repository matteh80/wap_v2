import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import Menuitem from './Menuitem'
import './Sidemenu.scss'

class Sidemenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employmentCount: 0,
      educationCount: 0,
      occupationCount: 0,
      skillCount: 0,
      languageCount: 0,
      motivationCount: 0,
      personalityCount: 0,
      videoCount: 0
    }
  }

  componentDidMount () {
    let $sidemenu = $('.sidemenuWrapper')
    let $navbarToggle = $('.navbar-toggle ')
    let $body = $('body')

    $sidemenu.mouseenter(function () {
      $body.addClass('menu-expanded')
      $navbarToggle.removeClass('collapsed')
    })
    $sidemenu.mouseleave(function () {
      $body.removeClass('menu-expanded')
      $navbarToggle.addClass('collapsed')
    })
  }

  componentWillReceiveProps (newProps) {
    // console.log(newProps)
    this.setState({
      employmentCount: newProps.employments.employments ? newProps.employments.employments.length : 0,
      educationCount: newProps.educations.educations ? newProps.educations.educations.length : 0,
      occupationCount: newProps.occupations.userOccupations ? newProps.occupations.userOccupations.length : 0,
      skillCount: newProps.skills.userSkills ? newProps.skills.userSkills.length : 0,
      languageCount: newProps.languages.userLanguages ? newProps.languages.userLanguages.length : 0,
      motivationCount: newProps.motivations.userMotivations ? newProps.motivations.userMotivations.length : 0,
      personalityCount: newProps.personalities.userPersonalities ? newProps.personalities.userPersonalities.length : 0,
      videoCount: newProps.wapfilm.video ? 1 : 0,
      drivinglicenseCount: newProps.drivinglicenses.userLicenses ? newProps.drivinglicenses.userLicenses.length : 0,
    })
  }

  render () {
    return (
      <div className='sidemenuWrapper'>
        <div className='sidemenu'>
          <ul className='menu-items'>
            <Menuitem to='/' icon='fa-home' title='Dashboard' onlyActiveOnIndex />
            <Menuitem to='/profile' icon='fa-user' title='Profil' />
            <Menuitem icon='fa-briefcase' title='Work'>
              <Menuitem to='/work/employments' icon='fa-building' title='Anställningar' count={this.state.employmentCount} details={this.state.employmentCount + ' anställningar'} />
              <Menuitem to='/work/educations' icon='fa-graduation-cap' title='Utbildningar' count={this.state.educationCount} details={this.state.educationCount + ' utbildningar'} />
              <Menuitem to='/work/skills' icon='fa-flash' title='Kompetenser' count={this.state.skillCount} details={this.state.skillCount + ' kompetenser'} />
              <Menuitem to='/work/languages' icon='fa-comment' title='Språk' count={this.state.languageCount} details={this.state.languageCount + ' språk'} />
              <Menuitem to='/work/drivinglicenses' icon='fa-car' title='Körkort' count={this.state.drivinglicenseCount} details={this.state.drivinglicenseCount + ' körkort'} />
            </Menuitem>
            <Menuitem icon='fa-cloud' title='Passion'>
              <Menuitem to='/passion/occupations' icon='fa-briefcase' title='Befattningar' count={this.state.occupationCount} details={this.state.occupationCount + ' befattningar'} />
              <Menuitem to='/passion/motivations' icon='fa-road' title='Drivkrafter' count={this.state.motivationCount} details={this.state.motivationCount + ' drivkrafter'} />
              <Menuitem to='/passion/personalities' icon='fa-user-circle' title='Personlighet' count={this.state.personalityCount} details={this.state.personalityCount + ' personlighetsdrag'} />
            </Menuitem>
            <hr />
            <Menuitem to='/wapfilm' icon='fa-video-camera' title='Wap film' count={this.state.videoCount}
              details={this.state.videoCount === 0 && 'Ladda upp en film'} />
            <Menuitem to='/personalitytest' icon='fa fa-bar-chart' title='Personlighetstest' />
            <hr />
            <Menuitem to='/cvbuilder' icon='fa fa-file-text' title='CV Builder' details="Skapa ett CV" />
          </ul>
        </div>
      </div>
    )
  }
}

export default connect((state) => state)(Sidemenu)
