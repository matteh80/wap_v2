import React from 'react'
import { connect } from 'react-redux'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import { getAllShares } from '../../store/actions/shareprofile'
import ShareForm from './ShareForm/ShareForm'
import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader';

class ShareProfile extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loadsave: true
    }
  }

  componentDidMount () {
    let { dispatch } = this.props
    dispatch(getAllShares()).then(() => {
      this.setState({
        loadsave: false
      })
    })
  }

  render () {
    let { shares } = this.props
    return (
      <Container fluid>
        <Loader active={this.state.loadsave} />
        <Row>
          <SpeechBubble xs='12'>
            <h3>Sök jobb enklare, dela din profil!</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Justo nec ultrices dui sapien eget mi proin. </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Justo nec ultrices dui sapien eget mi proin. </p>
          </SpeechBubble>
          <Col>
            <Row>
              {!this.state.loadsave &&
              <Col xs='12' sm='6' md='6' xl='4'>
                <ShareForm/>
              </Col>
              }
              {this.props.shares.shares && this.props.shares.shares.map((share) => {
                return (
                  <Col key={share.id} xs='12' sm='6' md='6' xl='4' className='shareItem'>
                    <Card>
                      <CardBlock>
                        <CardTitle>Titel</CardTitle>
                        <CardSubtitle>0 visningar</CardSubtitle>
                        <a href={'https://beta.wapcard.se/publicprofile/' + share.id}>
                          <h6>{share.id}</h6>
                        </a>
                      </CardBlock>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(ShareProfile)
