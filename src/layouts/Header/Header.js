import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../components/Misc/ProfilePicture'
import './Header.scss'
import { logout } from '../../store/actions/auth'

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

  render () {

    return (
      <div className='header'>
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
