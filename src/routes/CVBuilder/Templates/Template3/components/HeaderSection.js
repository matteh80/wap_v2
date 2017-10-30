import React from 'react'
import ProfilePicture from '../../../../../components/Misc/ProfilePicture/ProfilePicture'

import {
  Row,
  Col,
} from 'reactstrap'

const defaultPic = require('../../../../../../public/img/no_picture.jpg')
export default class HeaderSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageIsSet: false,
      imageUrl: 'https://api.wapcard.se/api/v1/profiles/' +
        props.profile.id +
        '/picture/500'
    }

    this.convertImageToCanvas = this.convertImageToCanvas.bind(this)
    this.onError = this.onError.bind(this)
  }

  componentDidMount () {
    this.convertImageToCanvas()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.imageIsSet && this.state.imageIsSet) {
      this.props.callBack()
    }

    if (prevState.imageUrl !== this.state.imageUrl) {
      this.convertImageToCanvas()
    }
  }

  convertImageToCanvas () {
    let _self = this
    let mCanvas = this.canvas
    mCanvas.width = 500
    mCanvas.height = 500
    let mContext = mCanvas.getContext('2d')
    let mImage = new Image()
    mImage.setAttribute('crossOrigin', '')
    mImage.src = this.state.imageUrl

    mImage.onload = function () {
      mContext.drawImage(mImage, 0, 0, 500, 500)
      // _self.setState({
      //   isSet: true
      // })
      _self.setState({
        imageIsSet: true
      })
    }
    mImage.onerror = function () {
      _self.onError()
    }
  }

  onError () {
    this.setState({
      imageUrl: defaultPic
    })
  }

  render () {
    let { profile } = this.props

    return (
      <header>
        <Row id='header' className='mx-0'>
          <Col xs={4}>
            {/* <img src={this.state.imageUrl} className='rounded-circle' /> */}
            <div className='profilePicture'>
              <canvas
                style={{ width: '100%' }}
                onError={this.onError}
                id='mCanvas'
                ref={canvas => {
                  this.canvas = canvas
                }}
              />
            </div>
          </Col>
          <Col xs={8} className='d-flex flex-column justify-content-center'>
            <Row>
              <Col xs={12}>
                <h1 className='name mb-0 mt-1'>{profile && profile.first_name + ' ' + profile.last_name}</h1>
                <h4 className='title'>{profile && profile.title}</h4>
              </Col>
            </Row>
            <div id='contactInfo' className='mb-3 pb-2'>
              <Row>
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
              </Row>
            </div>
          </Col>
        </Row>
      </header>
    )
  }
}
