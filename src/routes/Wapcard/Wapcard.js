import React from 'react'
import { connect } from 'react-redux'
import './Wapcard.scss'
import WapcardTemplate from './WapcardTemplate/WapcardTemplate'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import $ from 'jquery'
import { getProfile } from '../../store/actions/profile'
import { getMyPersonalities } from '../../store/actions/personalities'
import { getMyMotivations } from '../../store/actions/motivations'
import { getMyLanguages } from '../../store/actions/languages'
import { getAllEmployments } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'

import {
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

    let { dispatch } = this.props

    this.props.personalities.userPersonalities.length === 0 && dispatch(getMyPersonalities())
    this.props.motivations.userMotivations.length === 0 && dispatch(getMyMotivations())
    this.props.languages.userLanguages.length === 0 && dispatch(getMyLanguages())
    this.props.employments.employments.length === 0 && dispatch(getAllEmployments())
    this.props.educations.educations.length === 0 && dispatch(getAllEducations())

    this.createCanvas = this.createCanvas.bind(this)
    this.dataURItoBlob = this.dataURItoBlob.bind(this)
    this.publishFacebook = this.publishFacebook.bind(this)
    this.createPdf = this.createPdf.bind(this)
    this.isPictureSet = this.isPictureSet.bind(this)
  }

  componentDidMount () {
    let { dispatch } = this.props
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

  createPdf () {
    let { profile } = this.props
    let
      $content = $('#hiddenCV'),
      $body = $('body'),
      cacheWidth = $content.width(),
      a4 = [595.28, 841.89]  // for a4 size paper width and height

    $body.css('overflow', 'visible')
    // $content.appendTo('body')

    $content.css('visibility', 'visible')
    $body.scrollTop(0)

    let doc = new jsPDF({
      unit: 'px',
      format: 'a4'
    })

    doc.addImage($('.wapPreviewWrapper canvas')[0], 'JPEG', 0, 0)
    doc.save('wapcard' + profile.first_name + '_' + profile.last_name + '.pdf')
  }

  isPictureSet (set) {
    if (set) {
      this.setState({
        loadsave: false,
        creatingCanvas: true
      })
      // this.createCanvas()
    }
  }

  render () {
    return (
      <Container fluid>
        <Row className='flex-lg-row-reverse'>
          <Col>
            <SpeechBubble hideable pos='side'>
              <CardTitle>Det här är ditt wap card</CardTitle>
              <p>Wap card är ett helt nytt sätt att presentera sig på mot potentiella arbetsgivare. Det skapas utefter din profil och förutsättningar och det ger din potentiella arbetsgivare en bra överskådlig bild av dig.</p>
              <p>Du laddar enkelt ner det som en pdf eller skapar en delbar länk tillsammans med din resumé, wap film och eventuella körkort.</p>
              <p>Det för att du så enkelt som möjligt ska kunna söka jobb.</p>
            </SpeechBubble>
          </Col>
          <Col xs={12} sm={12} md={12} lg={7} style={{ maxWidth: 790 }}>
            <Loader active={this.state.loadsave} />
            <div className='hasShareDownloadBtn'>
              <ShareDownloadButtons onShare={this.shareWapcard} onDownload={this.createPdf} />
              <div className='wapPreviewWrapper mb-4 ' />
            </div>
          </Col>

        </Row>
        <WapcardTemplate
          isPictureSet={this.isPictureSet}
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
