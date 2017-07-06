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
      wapcard: null
    }
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
        loadsave: false
      })
      html2canvas($('.wapcardTemplateWrapper'), {
        imageTimeout: 2000,
        onrendered: function (canvas) {
          $('.wapPreviewWrapper').append(canvas)
          $('.wapPreviewWrapper canvas').addClass('img-fluid wapPreviewCanvas')
        }
      })
    }).catch((error) => {
      console.log(error)
      this.setState({
        loadsave: false
      })
    })
  }

  render () {
    return (
      <Container fluid>
        <Row>
          <Col xs={6}>
            <Loader active={this.state.loadsave} />
            <div className='wapPreviewWrapper' />
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
