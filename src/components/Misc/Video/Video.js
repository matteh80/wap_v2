import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import './Video.scss'
import {
  Row,
  Col,
  Progress
} from 'reactstrap'

class Video extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      videoSrc: this.props.videoSrc ? this.props.videoSrc : null,
      downloaded: false,
      downloading: false,
    }

    this.downloadVideoFromServer = this.downloadVideoFromServer.bind(this)
    this.addDownloadIcon = this.addDownloadIcon.bind(this)
  }

  addDownloadIcon () {
    return (
      <div onClick={this.downloadVideoFromServer}>
        <div style={{ background: 'rgb(15, 102, 116)' }} className='d-flex justify-content-center align-items-center flex-column'>
          <Col xs='10' sm='8' md='6' lg='5' xl='4'>
            <img src='/img/download_film.png' className='img-fluid mt-3' />
          </Col>
          <Col xs='12'>
            <h6 className='text-center my-2 fg-white'>Klicka här för att ladda ner och visa filmen</h6>
          </Col>
        </div>
      </div>
    )
    // return React.createElement(
    //   'div',
    //   {},
    //   React.createElement(
    //     'img',
    //     { onClick: this.downloadVideoFromServer, className: 'img-fluid', id: 'downloadIcon', style: { display: 'block' }, src: '/img/upload_film.png' },
    //   ),
    //   React.createElement(
    //     'h6',
    //     { className: 'text-center' },
    //     'Klicka här för att ladda ner och visa filmen.'
    //   )
    // )
  }

  downloadVideoFromServer () {
    let _self = this

    let url = 'https://api.wapcard.se/api/v1/download/videos/' + this.props.videoid

    let xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Token ' + _self.props.auth.token)
    xhr.responseType = 'arraybuffer'

    xhr.onload = function (oEvent) {
      let blob = new Blob([oEvent.target.response], { type: _self.props.content_type })

      _self.setState({
        videoSrc: URL.createObjectURL(blob),
        downloaded: true,
        downloading: false
      })

      // video.play()  if you want it to play on load
    }

    xhr.onprogress = function (oEvent) {
      _self.setState({
        downloading: true
      })

      if (oEvent.lengthComputable) {
        let percentComplete = oEvent.loaded / oEvent.total
        console.log(percentComplete)
        $('#progress .progress-bar').width(percentComplete * 100 + '%')
      }
    }

    xhr.send()
  }

  render () {
    return (
      <div id='videoWrapper'>
        {!this.state.downloaded && !this.state.downloading && !this.state.videoSrc && this.addDownloadIcon()}
        {this.state.downloading &&
        <Progress id='progress' value={0} color='#FA824F' min={0} max={1} style={{ width: '100%', padding: 0 }} />
        }
        {this.state.videoSrc && <video id='video' width='100%' height='auto' controls preload>
          <source src={this.state.videoSrc} />
          Your browser does not support HTML5 video.
        </video> }
      </div>
    )
  }
}

export default connect((state) => state)(Video)
