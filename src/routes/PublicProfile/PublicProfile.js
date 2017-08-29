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
import { getTranslate, getActiveLanguage } from 'react-localize-redux'
import _ from 'lodash'
import classNames from 'classnames'

import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardTitle,
  CardSubtitle,
  CardBlock
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader'
import Employment from './Employment/Employment'
import Education from './Education/Education'

class PublicProfile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profile: null,
      loadsave: true,
      creatingCanvas: false,
      showAll: false
    }

    this.createCanvas = this.createCanvas.bind(this)
    this.isPictureSet = this.isPictureSet.bind(this)
    this.createMarkup = this.createMarkup.bind(this)
  }

  componentDidMount () {
    let id = this.props.params.id
    axios.get('https://api.wapcard.se/api/v1/profile/temporary-links/' + id).then((result) => {
      this.setState({
        profile: {
          ...result.data,
          employments: _.reverse(result.data.employments),
          educations: _.reverse(result.data.educations)
        }
      })
      document.title = 'wap card | ' + result.data.first_name + ' ' + result.data.last_name
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

  createMarkup (text) {
    function str_replace_all (string, str_find, str_replace) {
      try {
        return string.replace(new RegExp(str_find, 'gi'), str_replace)
      } catch (ex) { return string }
    }

    let mText = text.replace(/(\r\n|\r|\n){2,}/g, '$1\n')
    mText = mText.replace(/(?:\r\n|\r|\n)/g, '<br />')

    let to = mText
    to = text.replace(/\n{2}/g, '&nbsp;</p><p>')
    to = to.replace(/\n/g, '&nbsp;<br />')
    to = '<p>' + to + '</p>'

    return { __html: to }
    // return { __html: text.replace(/(?:\r\n|\r|\n)/g, '<br />') }
  }

  render () {
    let video = this.state.profile && this.state.profile.videos[0]
    let { translate } = this.props
    let listClass = classNames('list', this.state.profile && this.state.profile.occupations.length > 6 && 'two-columns')

    const masonryOptions = {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
    }

    return (
      <div>
        <Loader active={this.state.loadsave} />
        <Container style={{ minHeight: '100vh' }} className='publicProfile'>

          <Row className='justify-content-xs-center justify-content-md-start'>
            <Col xs='5' sm='4' md='3' lg='2' className='my-3'>
              <img src='/img/wap_logga.png' className='img-fluid' />
            </Col>
          </Row>
          {this.state.profile &&
          <Masonry
            className='wrapper'
            options={masonryOptions}
            ref={function (c) {
              this.masonry = this.masonry || c.masonry
            }.bind(this)}
        >
            <div className='grid-item col col-lg-6 col-xl-8'>
              <Card style={{ overflow: 'hidden' }}>
                <CardBlock className='no-padding'>
                  <div className='wapPreviewWrapper' />
                </CardBlock>
              </Card>
            </div>

            {this.state.profile.personal_info.length > 0 &&
            <div className='grid-item grid-sizer col col-lg-6 col-xl-4'>
              <Card>
                <CardBlock>
                  <CardTitle>Resumé</CardTitle>
                  <CardText><blockquote dangerouslySetInnerHTML={this.createMarkup(this.state.profile.personal_info)} /></CardText>
                </CardBlock>
              </Card>
            </div>
          }

            {video &&
            <div className='grid-item grid-sizer col col-lg-6 col-xl-4'>
              <Card>
                <CardBlock>
                  <CardTitle>Wap film</CardTitle>
                  <Video videoSrc={this.state.videoSrc} videoid={video.id}
                    content_type={video.content_type} />
                </CardBlock>
              </Card>
            </div>
          }

            {this.state.profile.driving_licenses.length > 0 &&
            <div className='grid-item grid-sizer col col-lg-6 col-xl-4'>
              <Card>
                <CardBlock>
                  <CardTitle>{translate('publicprofile.driving_licenses')}</CardTitle>
                  <div className='d-flex align-items-center justify-content-center'>
                    {this.state.profile.driving_licenses.map((drivinglicense) => {
                      return (
                      <Col>
                        <div key={drivinglicense.id}
                          className={'licenseicon-korkort-' + drivinglicense.name.replace(' ', '-').replace(' ', '-').replace('å', 'a').toLowerCase() + ' licenseIcon'} />
                        <h6 className='text-center' style={{ marginTop: -30 }}>{drivinglicense.name}</h6>
                      </Col>
                    )
                    })}
                  </div>
                </CardBlock>
              </Card>
            </div>
          }

            {/* {this.state.profile.occupations.length > 0 && */}
            {/* <Col xs='12' sm='12' md='6' lg={this.state.profile.occupations.length > 6 ? '6' : '3'} xl={this.state.profile.occupations.length > 6 ? '4' : '2'} className='grid-item grid-sizer'> */}
            {/* <Card> */}
            {/* <CardBlock> */}
            {/* <CardTitle>{translate('publicprofile.occupations')}</CardTitle> */}
            {/* <ul className={listClass}> */}
            {/* {this.state.profile.occupations.map((occupation, index) => { */}
            {/* return ( */}
            {/* <li key={occupation.id}>{index + 1}. {occupation.name}</li> */}
            {/* ) */}
            {/* })} */}
            {/* </ul> */}
            {/* </CardBlock> */}
            {/* </Card> */}
            {/* </Col> */}
            {/* } */}

            {/* {this.state.profile.personalities.length > 0 && */}
            {/* <Col xs='12' sm='12' md='6' lg='3' xl='2' className='grid-item'> */}
            {/* <Card> */}
            {/* <CardBlock> */}
            {/* <CardTitle>{translate('publicprofile.personalities')}</CardTitle> */}
            {/* <ul className='list'> */}
            {/* {this.state.profile.personalities.map((personality) => { */}
            {/* return ( */}
            {/* <li key={personality.id}>{personality.name}</li> */}
            {/* ) */}
            {/* })} */}
            {/* </ul> */}
            {/* </CardBlock> */}
            {/* </Card> */}
            {/* </Col> */}
            {/* } */}

            {this.state.profile.employments.length > 0 && this.state.showAll &&
            <Col xs='12' sm='12' md='6' lg='4' xl='2' className='grid-item'>
              <Card>
                <CardBlock>
                  <CardTitle>{translate('publicprofile.employments')}</CardTitle>
                  <div className=''>
                    {this.state.profile.employments.map((employment) => {
                      return (
                      <Employment employment={employment} />
                    )
                    })}
                  </div>
                </CardBlock>
              </Card>
            </Col>
          }

            {this.state.profile.educations.length > 0 && this.state.showAll &&
            <Col xs='12' sm='12' md='6' lg='4' xl='2' className='grid-item'>
              <Card>
                <CardBlock>
                  <CardTitle>{translate('publicprofile.educations')}</CardTitle>
                  <div className=''>
                    {this.state.profile.educations.map((education) => {
                      return (
                      <Education education={education} />
                    )
                    })}
                  </div>
                </CardBlock>
              </Card>
            </Col>
          }

          </Masonry>
        }

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
      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
})

export default connect(mapStateToProps)(PublicProfile)
