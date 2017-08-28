import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './PublicProfile.scss'
import WapcardTemplate from '../Wapcard/WapcardTemplate/WapcardTemplate'
import $ from 'jquery'
import html2canvas from 'html2canvas'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Masonry from 'react-masonry-component'
import Video from '../../components/Misc/Video/Video'

import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardBlock
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader'

class PublicProfile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profile: null,
      loadsave: true,
      creatingCanvas: false
    }

    this.createCanvas = this.createCanvas.bind(this)
    this.isPictureSet = this.isPictureSet.bind(this)
  }

  componentDidMount () {
    let id = this.props.params.id
    axios.get('https://api.wapcard.se/api/v1/profile/temporary-links/' + id).then((result) => {
      this.setState({
        profile: result.data
      })
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.creatingCanvas && this.state.creatingCanvas) {
      this.createCanvas()
    }
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

  isPictureSet (set) {
    if (set) {
      this.setState({
        loadsave: false,
        creatingCanvas: true
      })
    }
  }

  render () {
    let video = this.state.profile && this.state.profile.videos[0]

    return (
      <Container fluid style={{ minHeight: '100vh' }}>
        <Loader active={this.state.loadsave} />
        <Row className='justify-content-xs-center justify-content-md-start'>
          <Col xs='5' sm='4' md='3' lg='2' xl='1' className='my-3'>
            <img src='/img/wap_logga.png' className='img-fluid' />
          </Col>
        </Row>
        <Masonry
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          <Col xs='12' sm='12' md='6' lg='4' className='item'>
            <Card style={{ overflow: 'hidden' }}>
              <CardBlock className='no-padding'>
                <div className='wapPreviewWrapper' />
              </CardBlock>
            </Card>
          </Col>

          {video &&
          <Col xs='12' sm='12' md='6' lg='4' xl='2' className='item'>
            <Card>
              <CardBlock>
                <CardTitle>Wap film</CardTitle>
                <Video videoSrc={this.state.videoSrc} videoid={video.id}
                  content_type={video.content_type} />
              </CardBlock>
            </Card>
          </Col>
          }

        </Masonry>

        {this.state.profile &&
          <WapcardTemplate
            isPictureSet={this.isPictureSet}
            profile={this.state.profile}
            personalities={this.state.profile.personalities}
            motivations={this.state.profile.motivations}
            languages={this.state.profile.languages}
            employments={this.state.profile.employments}
            educations={this.state.profile.educations}
            skills={this.state.profile.skills}
        />
        }
      </Container>
    )
  }
}

export default connect((state) => state)(PublicProfile)
