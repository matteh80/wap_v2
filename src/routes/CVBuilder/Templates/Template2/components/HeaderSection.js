import React from 'react'
import ProfilePicture from '../../../../../components/Misc/ProfilePicture/ProfilePicture'

import {
  Row,
  Col,
} from 'reactstrap'

export default class HeaderSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // this.setPicture(this.props.picPath)
  }

  render () {
    let { profile } = this.props

    return (
      <header>
        <Row id='header' className='mx-0 mb-5'>
          <Col xs={10}>
            <ProfilePicture canvas className='rounded-circle' />
          </Col>
          <Col xs={12} className='text-center'>
            <h4 className='name mb-0 mt-1 fg-white'>{profile && profile.first_name}</h4>
            <h4 className='name my-0 fg-white'>{profile && profile.last_name}</h4>
            <h6 className='title'>{profile && profile.title}</h6>
          </Col>
        </Row>
      </header>
    )
  }
}
