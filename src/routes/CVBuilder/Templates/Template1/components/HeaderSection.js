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
      <section>
        <Row id='header' className='align-items-center mb-5'>
          <Col xs={2} style={{ position: 'relative' }}>
            {/* <canvas id='mCanvas' width={500} height={500} className='img-responsive' /> */}

            <ProfilePicture canvas className='rounded-circle' />
            {/* <div style={{boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.2)", height: '100%', width: '100%'}} /> */}
            {/* <img src={this.props.picPath.picPath} style={{padding: '5%', position: 'absolute', top: 0, left: 0}} className="img-responsive img-circle" /> */}
            {/* <div className="img-circle" id="CVprofilePic" style={{background: 'url('+this.props.picPath.picPath+')', width: '100%', backgroundSize: 'cover'}}/> */}
          </Col>
          <Col xs={4} id='info'>
            <h3 id='first_name'>{profile && profile.first_name}</h3>
            <h3 id='last_name'>{profile && profile.last_name}</h3>
            <h6 id='title'>{profile && profile.title}</h6>
          </Col>
          <Col xs={6} id='contact'>
            <Row className='align-items-center'>
              <Col xs={12} className='d-flex'><i className='fa fa-envelope mr-1 mb-1' />{profile && profile.email}</Col>
            </Row>
            <Row>
              <Col xs={12} className='d-flex'><i className='fa fa-phone mr-1 mb-1' />{profile && profile.mobile_phone_number}</Col>
            </Row>
            <Row>
              <Col xs={12} className='d-flex'><i className='fa fa-globe mr-1 mb-1' />{profile && profile.home_page}</Col>
            </Row>
          </Col>
        </Row>
      </section>
    )
  }
}
