import React from 'react'

import {
  Col,
} from 'reactstrap'

export default class InfoSection extends React.Component {

  render () {
    let { profile } = this.props

    return (
      <div id='contactInfo' className='mb-3 pb-2'>
        <Col xs={12} className='d-flex align-items-center mb-2'>
          <i className='fa fa-envelope profileIcon mr-2' /><small>{profile.email}</small>
        </Col>
        {profile.mobile_phone_number &&
        <Col xs={12} className='d-flex align-items-center mb-2'>
          <i className='fa fa-phone profileIcon mr-2' />
          <small>{profile.mobile_phone_number}</small>
        </Col>
        }
        {profile.phone_number &&
        <Col xs={12} className='d-flex align-items-center mb-2'>
          <i className='fa fa-phone profileIcon mr-2' />
          <small>{profile.phone_number}</small>
        </Col>
        }
        {profile.home_page &&
        <Col xs={12} className='d-flex align-items-center mb-2'>
          <i className='fa fa-globe profileIcon mr-2' />
          <small>{profile.home_page}</small>
        </Col>
        }
      </div>
    )
  }
}
