import React from 'react'
import { connect } from 'react-redux'
import './Wapcard.scss'
import WapcardTemplate from './WapcardTemplate/WapcardTemplate'
import html2canvas from 'html2canvas'
import $ from 'jquery'
import { getProfile } from '../../store/actions/profile'
import { getMyPersonalities } from '../../store/actions/personalities'
import { getMyMotivations } from '../../store/actions/motivations'
import { getMyLanguages } from '../../store/actions/languages'
import { getAllEmployments } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'
import graph from 'fb-react-sdk'

import {
  Card,
  CardBlock,
  CardTitle,
  Container,
  Row,
  Col
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import ShareDownloadButtons from '../../components/buttons/ShareDownloadButtons'

let _self
class Wapcard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: true,
      wapcard: null,
      creatingCanvas: false
    }

    _self = this

    this.createCanvas = this.createCanvas.bind(this)
    this.dataURItoBlob = this.dataURItoBlob.bind(this)
    this.publishFacebook = this.publishFacebook.bind(this)
  }

  componentDidMount () {
    let { dispatch } = this.props
    Promise.all([
      dispatch(getProfile()),
      dispatch(getMyPersonalities()),
      dispatch(getMyMotivations()),
      dispatch(getMyLanguages()),
      dispatch(getAllEmployments()),
      dispatch(getAllEducations())
    ]).then(() => {
      this.setState({
        loadsave: false,
        creatingCanvas: true
      })
    }).catch((error) => {
      console.log(error)
      this.setState({
        loadsave: false
      })
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.creatingCanvas && this.state.creatingCanvas) {
      this.createCanvas()
    }
  }

  dataURItoBlob (dataURI) {
    let byteString = atob(dataURI.split(',')[1])
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {
      type: 'image/png'
    })
  }

  publishFacebook (authToken) {
    _self.setState({ loadsave: true })
    let canvas = $('.wapPreviewWrapper canvas')[0]
    let imageData = canvas.toDataURL('image/png')
    let blob
    try {
      blob = this.dataURItoBlob(imageData)
    } catch (e) {
      console.log(e)
    }
    let fd = new FormData()
    fd.append('access_token', authToken)
    fd.append('source', blob)
    // fd.append('message', 'Kika in mitt wap card')
    // fd.append('caption', 'Caption')
    try {
      $.ajax({
        url: 'https://graph.facebook.com/me/photos?access_token=' + authToken,
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
          console.log('success ' + data)
          $('.d-none').removeClass('d-none')
        },
        error: function (shr, status, data) {
          alert('error ' + data + ' Status ' + shr.status)
        },
        complete: function () {
          console.log('Posted to facebook')
          _self.setState({ loadsave: false })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  shareWapcard () {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        console.log('Logged in.')
        console.log(response.authResponse.accessToken)
        _self.publishFacebook(response.authResponse.accessToken)
      } else {
        FB.login(function (response) {
          console.log(response)
          _self.publishFacebook(response.authResponse.accessToken)
        }, {
          scope: 'publish_actions',
          return_scopes: true
        })
      }
    })
  }

  createCanvas () {
    let _self = this
    $('.wapcardTemplateWrapper').addClass('creatingCanvas')

    html2canvas($('.wapcardTemplateWrapper'), {
      imageTimeout: 6000,
      onrendered: function (canvas) {
        _self.setState({ creatingCanvas: false })
        $('.wapcardTemplateWrapper').removeClass('creatingCanvas')
        $('.wapPreviewWrapper').append(canvas)
        $('.wapPreviewWrapper canvas').addClass('img-fluid wapPreviewCanvas')
      }
    })
  }

  render () {
    return (
      <Container fluid>
        <Row className='flex-column-reverse flex-lg-row'>
          <Col xs={12} sm={12} md={12} lg={7} style={{ maxWidth: 790 }}>
            <Loader active={this.state.loadsave} />
            <SpeechBubble pos='bottom-side' className='d-none'>
              <h4>Du har nu delat ditt wap card till Facebook!</h4>
            </SpeechBubble>
            <div className='hasShareDownloadBtn'>
              <ShareDownloadButtons onShare={this.shareWapcard} />
              <div className='wapPreviewWrapper mb-4 ' />
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={5}>
            <SpeechBubble pos='left-side top'>
              <CardTitle>Det här är ditt wap card</CardTitle>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida nibh at nisi accumsan, quis luctus est euismod. Curabitur vel finibus leo. Phasellus maximus enim eget neque posuere aliquet. Aliquam id sem vitae justo semper suscipit. Nulla ullamcorper arcu urna, quis lacinia turpis scelerisque ac. Aliquam interdum nisi eget eros cursus finibus. Mauris tempus velit sem, et rutrum nulla vulputate vel. Maecenas magna nulla, rutrum at molestie eu, efficitur interdum augue.</p>
              <p>Maecenas eu lacus imperdiet, molestie dolor nec, venenatis ipsum. Sed vitae posuere nunc. Cras vestibulum quam et diam viverra vulputate. Mauris a leo lectus. Morbi tempor imperdiet magna, vitae euismod ex imperdiet at. Nam a hendrerit quam. Nam accumsan metus sed turpis hendrerit viverra. </p>
            </SpeechBubble>
          </Col>
        </Row>
        <WapcardTemplate
          profile={this.props.profile}
          personalities={this.props.personalities.userPersonalities}
          motivations={this.props.motivations.userMotivations}
          languages={this.props.languages.userLanguages}
          employments={this.props.employments.employments}
          educations={this.props.educations.educations}
          skills={this.props.skills.userSkills}
        />
      </Container>
    )
  }
}

export default connect((state) => state)(Wapcard)
