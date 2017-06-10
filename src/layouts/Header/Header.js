import React from 'react'
import { connect } from 'react-redux'
import ProfilePicture from '../../components/Misc/ProfilePicture'
import './Header.scss'

import {
  Row
} from 'reactstrap'

class Header extends React.Component {

  render () {

    return (
      <div className='header'>
        <div className='pull-right profile-picture'>
          <ProfilePicture profile={this.props.profile} />
          <div className='overlay' />
        </div>
      </div>
    )
  }
}

export default connect((state) => state)(Header)
