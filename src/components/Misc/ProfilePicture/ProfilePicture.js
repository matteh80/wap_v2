import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import './ProfilePIcture.scss'
import Loader from '../../../components/Misc/Loader/Loader'
import { uploadProfilePic } from '../../../store/actions/profile'
import classNames from 'classnames'
import $ from 'jquery'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap'

const defaultPic = require('../../../../public/img/no_picture.jpg')

class ProfilePicture extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageUrl: '',
      modal: false,
      tmpImage: '',
      loadsave: false,
      isSet: false,
      userId: props.userId ? props.userId : props.profile.id
    }

    this.onError = this.onError.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this._crop = this._crop.bind(this)
    this.dataURItoBlob = this.dataURItoBlob.bind(this)
    this.convertImageToCanvas = this.convertImageToCanvas.bind(this)
  }

  componentWillMount () {
    let _self = this
    let request = new XMLHttpRequest()
    request.open('GET', 'https://api.wapcard.se/api/v1/profiles/' + _self.state.userId + '/picture/500?' + _self.props.profile.picture, true)
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 404) {
          _self.setState({
            imageUrl: defaultPic
          })
        } else {
          _self.setState({
            imageUrl: 'https://api.wapcard.se/api/v1/profiles/' + _self.state.userId + '/picture/500?' + _self.props.profile.picture
          })
        }
      }
    }
    request.send()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.imageUrl !== this.state.imageUrl) {
      console.log('will set canvas')
      this.props.canvas && this.convertImageToCanvas()
    }

    if (!prevState.isSet && this.state.isSet) {
      this.props.isSet && this.props.isSet(true)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.profile.picture !== this.props.profile.picture) {
      this.setState({
        imageUrl: 'https://api.wapcard.se/api/v1/profiles/' + this.state.userId + '/picture/500?' + newProps.profile.picture
      })
    }
  }

  onError () {
    this.setState({
      imageUrl: defaultPic
    })
  }

  onDrop (acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles)
    this.setState({
      tmpImage: acceptedFiles[0].preview
    }, this.toggleModal())
  }

  toggleModal () {
    this.setState({
      modal: !this.state.modal
    })
  }

  _crop () {
    console.log('crop')
    this.setState({
      loadsave: true
    })
    let { dispatch } = this.props

    let blob = this.dataURItoBlob(this.refs.cropper.getCroppedCanvas().toDataURL())
    let fd = new FormData()

    fd.append('file', blob)

    dispatch(uploadProfilePic(fd)).then(() => {
      this.setState({
        loadsave: false,
        modal: false
      })
    })
  }

  dataURItoBlob (dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1])
    } else {
      byteString = unescape(dataURI.split(',')[1])
    }

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type:mimeString })
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
      _self.setState({
        isSet: true
      })
    }
  }

  render () {
    let imgClass = classNames('card-img img-fluid', this.props.className)

    return (
      <div className='profilePicture'>
        {this.props.editMode &&
          <div className='uploadWrapper'>
            <Dropzone
              accept='image/*'
              style={dropzoneStyle}
              activeStyle={activeDropzoneStyle}
              onDrop={this.onDrop}
            >
              <i className='fa fa-camera-retro' />
            </Dropzone>
          </div>}

        {this.props.canvas
        ? <canvas style={{ width: '100%' }} onError={this.onError} id='mCanvas' ref={(canvas) => { this.canvas = canvas }} />
        : <img src={this.state.imageUrl} className={imgClass} style={{ width: '100%' }} onError={this.onError} />
        }

        {/* <div className='mImgWrapper'> */}
        {/* /!* <img src={this.state.imageUrl} className={imgClass} style={{ width: '100%' }} onError={this.onError} /> *!/ */}
        {/* <canvas style={{ width: '100%' }} onError={this.onError} ref={(canvas) => { this.canvas = canvas }} /> */}
        {/* </div> */}

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <Loader active={this.state.loadsave} />
          <ModalBody className='no-padding'>
            <Cropper
              ref='cropper'
              src={this.state.tmpImage}
              style={{ height: 400, width: '100%' }}
              // Cropper.js options
              aspectRatio={1 / 1}
              guides={false} />
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this._crop()}>Klar</Button>{' '}
            <Button color='secondary' onClick={this.toggleModal}>Avbryt</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default connect((state) => state)(ProfilePicture)

const dropzoneStyle = {
  width: '100%',
  height: '100%',
  background: 'rgba(255,255,255,0)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const activeDropzoneStyle = {
  border: '5px solid rgba(0,0,0,0.5)'
}
