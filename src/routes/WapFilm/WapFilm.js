import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import './WapFilm.scss'
import { uploadVideo, getVideoInfo, removeVideo, setVideoInfo } from '../../store/actions/wapfilm'
import Video from '../../components/Misc/Video/Video'
import Loader from '../../components/Misc/Loader/Loader'
import Masonry from 'react-masonry-component'
import $ from 'jquery'
import { apiClient } from '../../store/axios.config'

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Progress,
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble';

class WapFilm extends React.Component {
  constructor (props) {
    super(props)
    let { dispatch } = this.props

    this.state = {
      videoSrc: null,
      videoExists: false,
      loadsave: false
    }

    dispatch(getVideoInfo()).then(() => {
      this.setState({
        videoExists: this.props.wapfilm.video && this.props.wapfilm.video.id !== undefined
      })
    })

    this.onDrop = this.onDrop.bind(this)
    this.getVideoSize = this.getVideoSize.bind(this)
    this.removeVideo = this.removeVideo.bind(this)
  }

  onDrop (acceptedFiles, rejectedFiles) {
    let { dispatch } = this.props
    this.setState({
      videoSrc: acceptedFiles[0].preview,
      loadsave: true
    })
    if (acceptedFiles.length > 0) {
      let data = new FormData()
      data.append('file', acceptedFiles[0])
      // dispatch(uploadVideo(data)).then(() => {
      //   this.setState({
      //     loadsave:false,
      //     videoExists: true
      //   })
      // })

      this.uploadVideoToServer(data)
    }
  }

  uploadVideoToServer (data) {
    let { dispatch } = this.props
      this.setState({
        loadsave:true,
        videoExists: true
      })
    apiClient.post('me/videos/',
      data, {
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
          $('#progress .progress-bar').width(percentCompleted + '%')
        }
      }).then((result) => {
        dispatch(setVideoInfo(result.data))
        this.setState({ loadsave: false })
      }
    )
      .catch(function (error) {
        console.log(error)
      })
  }

  removeVideo () {
    let { dispatch } = this.props
    this.setState({
      videoExists: false
    })
    dispatch(removeVideo(this.props.wapfilm.video.id))
  }

  getVideoSize (bytes) {
    return parseFloat(Math.abs(bytes / 1048576)).toFixed(2) + ' Mb'
  }

  render () {
    let { video } = this.props.wapfilm
    return (
      <Container fluid>
        <Row className='flex-lg-row-reverse'>
          <Col>
            <SpeechBubble pos='side'>
              WAP Film är en 60 s video där du har möjlighet att kort presentera dig själv för potentiella
              arbetsgivare. Du kommer svara på 6 st frågor som vi tagit fram och det finns inget rätt eller fel svar.
              Du spelar in filmen själv och laddar sedan upp den när du känner dig nöjd.
              Filmen kommer endast vara tillgängliga för våra rekryterare och eventuellt arbetsgivare. Det är du
              som bestämmer om du vill att arbetsgivaren ska få ta del av din film.
              Genom att göra din egen wap film ökar du chansen betydligt till att nå ditt drömjobb då hela 87% av
              våra 800 arbetsgivare efterfrågar den.

              <h4 style={{ textTransform: 'initial', marginTop: 20 }}>Så här gör du:</h4>

              Filma dig själv med din mobilkamera. Sätt kameran ca 1m från dig och se till att du har tillräckligt
              med ljus för att få bilden skarp och att det inte är förmycket ljud i bakgrunden.
              Ha frågorna tillgängliga. När du är nöjd med din presentationsfilm laddar du upp den här.
              Tänk på att filmen är inte en audition för en filmroll, vi har inget intresse i ditt yttre utan är endast
              ute efter att få veta lite mer om dig, vad du brinner för och få se din unika karisma. Stakar du dig
              eller säger fel behöver du nödvändigtvis inte filma om, det handlar bara om att vi ska få svar så vi får
              en tydligare bild av dig. Slutligen, du är alltid bäst på att vara du så du behöver inte göra dig till.
            </SpeechBubble>
          </Col>
          <Col xs={12} lg={7} className='dropzone'>
            <Card>
              {this.state.videoExists &&
              <div>
                <div className='btn-wrapper'>
                  <i className='fa fa-times cancel-btn' onClick={() => this.removeVideo()} />
                </div>
                {this.state.loadsave &&
                <Progress id='progress' value={0} color='#FA824F' min={0} max={100}
                          style={{ width: '100%', padding: 0 }} />
                }
                {video &&
                <CardHeader>
                  {video.filename} ({this.getVideoSize(video.size)})
                </CardHeader>
                }
                <Video videoSrc={this.state.videoSrc} videoid={video && video.id} content_type={video && video.content_type} />
              </div>
              }
              {!this.state.videoExists &&
              <Dropzone
                accept='video/*'
                style={dropzoneStyle}
                activeStyle={activeDropzoneStyle}
                onDrop={this.onDrop}
              >
                {/*<Loader active={this.state.loadsave} />*/}

                <Row className='flex-column justify-content-center align-items-center py-5'>
                  <i className='fa fa-film videoicon' />
                  Dra och släpp en fil för att ladda upp
                  <ThreeDButton small>Eller välj en fil</ThreeDButton>
                </Row>
              </Dropzone>
              }
            </Card>
            <Card>
              <video id='loopvideo' width='100%' height='auto' controls>
                <source src='/img/wap-film_informationsfilm.mp4' type='video/mp4' />
                Your browser do not support this file
              </video>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(WapFilm)

const dropzoneStyle = {
  width: '100%',
  height: '100%',
  background: 'rgba(255,255,255,0.65)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const activeDropzoneStyle = {
  background: 'rgba(225,225,225,1)',
}
