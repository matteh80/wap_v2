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

import {
  Card,
  CardBlock,
  CardTitle,
  Container,
  Row,
  Col
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader'

class Wapcard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: true,
      wapcard: null,
      creatingCanvas: false
    }

    this.createCanvas = this.createCanvas.bind(this)
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

  createCanvas () {
    $('.wapcardTemplateWrapper').addClass('creatingCanvas')

    html2canvas($('.wapcardTemplateWrapper'), {
      imageTimeout: 6000,
      onrendered: function (canvas) {
        $('.wapcardTemplateWrapper').removeClass('creatingCanvas')
        $('.wapPreviewWrapper').append(canvas)
        $('.wapPreviewWrapper canvas').addClass('img-fluid wapPreviewCanvas')
      }
    })
  }

  render () {


    return (
      <Container fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={7}>
            <Loader active={this.state.loadsave} />
            <div className='wapPreviewWrapper' />
          </Col>
          <Col xs={12} sm={12} md={12} lg={5}>
            <Card className='speechBubble'>
              <CardBlock>
                <CardTitle>Det här är ditt wap card</CardTitle>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida nibh at nisi accumsan, quis luctus est euismod. Curabitur vel finibus leo. Phasellus maximus enim eget neque posuere aliquet. Aliquam id sem vitae justo semper suscipit. Nulla ullamcorper arcu urna, quis lacinia turpis scelerisque ac. Aliquam interdum nisi eget eros cursus finibus. Mauris tempus velit sem, et rutrum nulla vulputate vel. Maecenas magna nulla, rutrum at molestie eu, efficitur interdum augue.</p>
                <p>Maecenas eu lacus imperdiet, molestie dolor nec, venenatis ipsum. Sed vitae posuere nunc. Cras vestibulum quam et diam viverra vulputate. Mauris a leo lectus. Morbi tempor imperdiet magna, vitae euismod ex imperdiet at. Nam a hendrerit quam. Nam accumsan metus sed turpis hendrerit viverra. </p>
              </CardBlock>
            </Card>
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
