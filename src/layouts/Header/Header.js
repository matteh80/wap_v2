import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../components/Misc/ProfilePicture'
import './Header.scss'
import { logout } from '../../store/actions/auth'
import $ from 'jquery'

import {
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

  handleLogout () {
    let { dispatch } = this.props
    dispatch(logout())
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
    return (
      <div className='header'>
        <div className='hidden-md-down pull-left h-100 p-2 ml-1'>
          <img src='/img/bee_100.png' style={{ maxHeight: '100%', width: 'auto' }} />
        </div>
        <div className='navbar-toggle hidden-lg-up pull-xs-left collapsed' aria-label='Toggle navigation' onClick={() => this._toggleMenu()}>
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

            <DropdownMenu>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem onClick={(e) => this.handleLogout(e)}>Logga ut</DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </div>
      </div>
    )
  }
}

export default connect((state) => state)(Header)
