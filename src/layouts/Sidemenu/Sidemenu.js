import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import Menuitem from './Menuitem'
import './Sidemenu.scss'
import ReactGA from 'react-ga'

class Sidemenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      employmentCount: props.employments.employments ? props.employments.employments.length : 0,
      educationCount: props.educations.educations ? props.educations.educations.length : 0,
      occupationCount: props.occupations.userOccupations ? props.occupations.userOccupations.length : 0,
      skillCount: props.skills.userSkills ? props.skills.userSkills.length : 0,
      languageCount: props.languages.userLanguages ? props.languages.userLanguages.length : 0,
      motivationCount: props.motivations.userMotivations ? props.motivations.userMotivations.length : 0,
      personalityCount: props.personalities.userPersonalities ? props.personalities.userPersonalities.length : 0,
      videoCount: props.wapfilm.video ? 1 : 0,
      drivinglicenseCount: props.drivinglicenses.userLicenses ? props.drivinglicenses.userLicenses.length : 0,
      referenceCount: props.references.references ? props.references.references.length : 0,
      jobCount: props.jobs.savedJobs ? props.jobs.savedJobs.length : 0,
      personalitytestCompleted: props.talentq && props.talentq.completed ? 1 : 0,
      locationCount: props.locations.userLocations ? props.locations.userLocations.length : 0,
    }

    this.showMenu = this.showMenu.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.onSocialClick = this.onSocialClick.bind(this)
  }

  componentDidMount () {
    let $sidemenu = $('.sidemenuWrapper')
    let _self = this

    $sidemenu.mouseenter(function () {
      _self.showMenu()
    })
    $sidemenu.mouseleave(function () {
      _self.hideMenu()
    })
  }

  componentWillReceiveProps (newProps) {
    this.setCounts(newProps)
    if (newProps.routing.locationBeforeTransitions.pathname !== this.props.routing.locationBeforeTransitions.pathname) {
      $('html, body').animate({
        scrollTop: 0
      }, 0)
    }
  }

  showMenu () {
    let $navbarToggle = $('.navbar-toggle ')
    let $body = $('body')
    $body.addClass('menu-expanded overflow-x-hidden')
    $navbarToggle.removeClass('collapsed')
  }

  hideMenu () {
    let $navbarToggle = $('.navbar-toggle ')
    let $body = $('body')
    $body.removeClass('menu-expanded')
    $navbarToggle.addClass('collapsed')
    $('.page_wrapper').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
      function () {
        $body.removeClass('overflow-x-hidden')
        $('.page_wrapper').off('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd')
      }
    )
  }

  setCounts (props) {
    this.setState({
      employmentCount: props.employments.employments ? props.employments.employments.length : 0,
      educationCount: props.educations.educations ? props.educations.educations.length : 0,
      occupationCount: props.occupations.userOccupations ? props.occupations.userOccupations.length : 0,
      skillCount: props.skills.userSkills ? props.skills.userSkills.length : 0,
      languageCount: props.languages.userLanguages ? props.languages.userLanguages.length : 0,
      motivationCount: props.motivations.userMotivations ? props.motivations.userMotivations.length : 0,
      personalityCount: props.personalities.userPersonalities ? props.personalities.userPersonalities.length : 0,
      videoCount: props.wapfilm.video ? 1 : 0,
      drivinglicenseCount: props.drivinglicenses.userLicenses ? props.drivinglicenses.userLicenses.length : 0,
      referenceCount: props.references.references ? props.references.references.length : 0,
      jobCount: props.jobs.savedJobs ? props.jobs.savedJobs.length : 0,
      personalitytestCompleted: props.talentq && props.talentq.completed ? 1 : 0,
      locationCount: props.locations.userLocations ? props.locations.userLocations.length : 0,
    })
  }

  onSocialClick (e) {
    e.preventDefault()
    console.log(e.currentTarget)
    ReactGA.event({
      category: 'Social click',
      action: 'Clicked icon in menu',
      label: e.currentTarget.id,
    })

    window.location = e.currentTarget.href
  }

  render () {
    let { translate } = this.props

    return (
      <div className='sidemenuWrapper'>
        <div className='sidemenu'>
          <ul className='menu-items'>
            <Menuitem to='/' icon='fa-home' title='Dashboard' onlyActiveOnIndex />
            <Menuitem to='/profile' icon='fa-user' title={translate('sidemenu.profile')} />
            <Menuitem icon='fa-briefcase' title='Work'>
              <Menuitem to='/work/employments' icon='fa-building' title={translate('sidemenu.employments')} count={this.state.employmentCount} details={this.state.employmentCount + ' anställningar'} />
              <Menuitem to='/work/educations' icon='fa-graduation-cap' title={translate('sidemenu.educations')} count={this.state.educationCount} details={this.state.educationCount + ' utbildningar'} />
              <Menuitem to='/work/skills' icon='fa-flash' title={translate('sidemenu.skills')} count={this.state.skillCount} details={this.state.skillCount + ' kompetenser'} />
              <Menuitem to='/work/languages' icon='fa-comment' title={translate('sidemenu.languages')} count={this.state.languageCount} details={this.state.languageCount + ' språk'} />
              <Menuitem to='/work/drivinglicenses' icon='fa-car' title={translate('sidemenu.drivingLicenses')} count={this.state.drivinglicenseCount} details={this.state.drivinglicenseCount + ' körkort'} />
              <Menuitem to='/work/references' icon='fa-address-book' title={translate('sidemenu.references')} count={this.state.referenceCount} details={translate('sidemenu.referencesCount', { count: this.state.referenceCount })} />
            </Menuitem>
            <Menuitem icon='fa-cloud' title='Passion'>
              <Menuitem to='/passion/dreamjob' icon='fa-rocket' title='Drömjobb' details={translate('sidemenu.whats_your_dreamjob')} />
              <Menuitem to='/passion/occupations' icon='fa-briefcase' title='Befattningar' count={this.state.occupationCount} details={this.state.occupationCount + ' befattningar'} />
              <Menuitem to='/passion/motivations' icon='fa-road' title='Drivkrafter' count={this.state.motivationCount} details={this.state.motivationCount + ' drivkrafter'} />
              <Menuitem to='/passion/personalities' icon='fa-user-circle' title='Personlighet' count={this.state.personalityCount} details={this.state.personalityCount + ' personlighetsdrag'} />
              <Menuitem to='/passion/location' icon='fa-map-marker' title='Plats' count={this.state.locationCount}
                details={this.state.locationCount === 0 ? translate('sidemenu.where_location') : this.state.locationCount === 1 ? '1 vald ort' : this.state.locationCount + ' valda orter'} />
            </Menuitem>
            <hr />
            <Menuitem to='/wapfilm' icon='fa-video-camera' title='Wap film' count={this.state.videoCount}
              details={this.state.videoCount === 0 && 'Ladda upp en film'} />
            <Menuitem to='/personalitytest' icon='fa fa-bar-chart' title='Personlighetstest' details='TalentQ' count={this.state.personalitytestCompleted} />
            {/*<Menuitem to='/wapstory' icon='fa fa-clock-o' title='Wap story' details='Håll koll på dina jobb' />*/}
            <hr />
            <Menuitem to='/wapcard' icon='fa-vcard' title='Wap card' details={translate('sidemenu.show_wapcard')} />
            <Menuitem to='/cvbuilder' icon='fa-file-text' title='CV Builder' details='Skapa ett CV' />
            <hr />
            <Menuitem to='/personalrecruiter' icon='fa-user-md' title='Personlig rekryterare' details='Din hjälp i jobbsökandet' />
            <Menuitem icon='fa-sticky-note' title={translate('sidemenu.jobs')}>
              <Menuitem indexlink to='/jobs' icon='fa-newspaper-o' title='Lediga tjänster' />
              {this.state.jobCount > 0 && <Menuitem to='/jobs/my' icon='fa-lightbulb-o' title='Visade tjänster' />}
            </Menuitem>
            <hr />
            <Menuitem to='/shareprofile' icon='fa-share-alt' title='Dela wap-profil' details='Sök jobb med wap' />
          </ul>
        </div>
        <div className='contact my-4'>
          <a href='https://www.facebook.com/wapcard.se' id='facebook' onClick={this.onSocialClick}><i className='fa fa-facebook' /></a>
          <a href='mailto:support@wapcard.se' id='mail' onClick={this.onSocialClick}><i className='fa fa-envelope' /></a>
        </div>
      </div>
    )
  }
}

export default connect((state) => state)(Sidemenu)
