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
        <Row id='header' className='mx-0 mb-5'>
          <Col xs={10}>
            {/* <img src={this.state.imageUrl} className='rounded-circle' /> */}
            <div className='profilePicture'>
              <canvas
                onError={this.onError}
                id='mCanvas'
                ref={canvas => {
                  this.canvas = canvas
                }}
              />
            </div>
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
