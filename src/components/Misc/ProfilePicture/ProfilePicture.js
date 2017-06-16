import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import './ProfilePIcture.scss'
import Loader from '../../../components/Misc/Loader/Loader'
import { uploadProfilePic } from '../../../store/actions/profile'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap'

const defaultPic = require('../../../../public/img/no_picture.jpg')

class ProfilePicture extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageUrl: 'https://api.wapcard.se/api/v1/profiles/' + this.props.profile.id + '/picture/500?' + this.props.profile.picture,
      modal: false,
      tmpImage: '',
      loadsave: false
    }

    this.onError = this.onError.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this._crop = this._crop.bind(this)
    this.dataURItoBlob = this.dataURItoBlob.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.profile.picture !== this.props.profile.picture) {
      this.setState({
        imageUrl: 'https://api.wapcard.se/api/v1/profiles/' + this.props.profile.id + '/picture/500?' + newProps.profile.picture
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

  render () {
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
        <img src={this.state.imageUrl} className='img-fluid' style={{ width: '100%' }} onError={this.onError} />

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <Loader active={this.state.loadsave} />
          <ModalBody className='no-padding'>
            {/* <img src='http://via.placeholder.com/1920x1080' className='img-fluid' /> */}
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
  background: 'rgba(255,255,255,0.65)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const activeDropzoneStyle = {
  border: '5px solid rgba(0,0,0,0.5)'
}
