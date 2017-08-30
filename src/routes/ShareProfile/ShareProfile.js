import React from 'react'
import { connect } from 'react-redux'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import { getAllShares, deleteShare } from '../../store/actions/shareprofile'
import ShareForm from './ShareForm/ShareForm'
import Masonry from 'react-masonry-component'
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
import EditButtons from '../../components/buttons/EditButtons';

class ShareProfile extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loadsave: true
    }

    this.onRemove = this.onRemove.bind(this)
    this.layout = this.layout.bind(this)
  }

  componentDidMount () {
    let { dispatch } = this.props
    dispatch(getAllShares()).then(() => {
      this.setState({
        loadsave: false
      })
    })
  }

  onRemove (id) {
    let { dispatch } = this.props
    dispatch(deleteShare(id))
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { shares } = this.props

    return (
      <Container fluid>
        <Row>
          <SpeechBubble xs='12'>
            <h3>Sök jobb enklare, dela din profil!</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Justo nec ultrices dui sapien eget mi proin. </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Justo nec ultrices dui sapien eget mi proin. </p>
          </SpeechBubble>
          <Col>
            <Masonry
              className='row'
              ref={function (c) {
                this.masonry = this.masonry || c.masonry
              }.bind(this)}
            >
              {this.props.shares.shares && this.props.shares.shares.map((share) => {
                return (
                  <Col key={share.id} xs='12' sm='6' md='6' xl='4' className='shareItem'>
                    <Card>
                      <EditButtons onlyRemove translate={this.props.translate} onRemove={() => this.onRemove(share.id)} />
                      <CardBlock>
                        <CardTitle>{share.name}</CardTitle>
                        <CardSubtitle>{share.access_count} visningar</CardSubtitle>
                        <div>
                          <i className='fa fa-link' />
                          <a href={'https://beta.wapcard.se/publicprofile/' + share.id}>
                            {' '}https://beta.wapcard.se/publicprofile/{share.id}
                          </a>
                        </div>
                      </CardBlock>
                    </Card>
                  </Col>
                )
              })}
              {!this.state.loadsave &&
              <Col xs='12' sm='6' md='6' xl='4'>
                <ShareForm layout={this.layout} />
              </Col>
              }
            </Masonry>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(ShareProfile)
