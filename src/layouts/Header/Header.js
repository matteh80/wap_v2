import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../components/Misc/ProfilePicture/ProfilePicture'
import './Header.scss'
import { logout } from '../../store/actions/auth'
import $ from 'jquery'
import { setActiveLanguage, getTranslate, getActiveLanguage } from 'react-localize-redux'
import classNames from 'classnames'

import {
  Row,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profileDropdownOpen: false
    }

    this.toggleProfileDropdown = this.toggleProfileDropdown.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this._toggleMenu = this._toggleMenu.bind(this)
  }

  toggleProfileDropdown () {
    this.setState({
      profileDropdownOpen: !this.state.profileDropdownOpen
    })
  }

  toggleLocale () {
    let { dispatch } = this.props
    switch (this.props.currentLanguage) {
      case 'sv':
        dispatch(setActiveLanguage('en'))
        break
      case 'en':
        dispatch(setActiveLanguage('sv'))
        break
    }
  }

  handleLogout () {
    let { dispatch } = this.props
    dispatch(logout())
  }

  componentWillReceiveProps (newProps) {
    let $navbarToggle = $('.navbar-toggle')
    if (newProps.routing.locationBeforeTransitions.pathname !== this.props.routing.locationBeforeTransitions.pathname && $navbarToggle.is(':visible') && !$navbarToggle.hasClass('collapsed')) {
      this._toggleMenu()
    }
  }

  _toggleMenu () {
    let $body = $('body')
    let $navbarToggle = $('.navbar-toggle ')
    if ($body.hasClass('menu-expanded')) {
      $body.removeClass('menu-expanded')
      $navbarToggle.addClass('collapsed')
    } else {
      $body.addClass('menu-expanded')
      $navbarToggle.removeClass('collapsed')
    }
  }

  render () {
    let { translate } = this.props
    let menuClass = classNames(this.state.profileDropdownOpen && 'show')

    return (
      <div className='header'>
        <div className='d-none d-lg-block pull-left h-100 logo'>
          <Row className='justify-content-center align-items-center h-100'>
            <img src='/img/bee_100.png' style={{ maxHeight: '100%', width: 'auto' }} />
          </Row>
        </div>
        <div className='navbar-toggle d-lg-none pull-xs-left collapsed' aria-label='Toggle navigation' onClick={() => this._toggleMenu()}>
          <span className='bar1' />
          <span className='bar2' />
          <span className='bar3' />
        </div>

        <div className='pull-right profile-picture'>
          <Dropdown isOpen={this.state.profileDropdownOpen} toggle={this.toggleProfileDropdown}>
            <ProfilePicture profile={this.props.profile} />
            <div className='overlay' onClick={(e) => this.toggleProfileDropdown(e)}>
              <i className='fa fa-chevron-down' />
            </div>

            <DropdownMenu className={menuClass}>
              <DropdownItem onClick={(e) => this.handleLogout(e)}>{translate('header.logout')}</DropdownItem>
              <DropdownItem>
                <div className='locale pull-right' onClick={() => this.toggleLocale()}>
                  <img src={'/img/locale_' + this.props.currentLanguage + '.png'} className='img-fluid' style={{ height: 20 }} />
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/*<div className='locale pull-right' onClick={() => this.toggleLocale()}>*/}
          {/*<img src={'/img/locale_' + this.props.currentLanguage + '.png'} className='img-fluid' style={{ height: 60 }} />*/}
        {/*</div>*/}

      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
  ...state
})

export default connect(mapStateToProps)(Header)
