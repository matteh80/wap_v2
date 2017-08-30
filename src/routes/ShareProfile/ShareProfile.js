import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import { getAllShares, deleteShare } from '../../store/actions/shareprofile'
import ShareForm from './ShareForm/ShareForm'
import Masonry from 'react-masonry-component'
import $ from 'jquery'
import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Alert
} from 'reactstrap'
import ShareProfileButtons from '../../components/buttons/ShareProfileButtons'

class ShareProfile extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loadsave: true,
      copied: false
    }

    this.onRemove = this.onRemove.bind(this)
    this.layout = this.layout.bind(this)
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onCopyClick = this.onCopyClick.bind(this)
    this.closeAlert = this.closeAlert.bind(this)
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

  onLinkClick (id) {
    window.open('/publicprofile/' + id)
  }

  onCopyClick (id) {
    let $temp = $('<input>')
    $('body').append($temp)
    $temp.val('https://' + window.location.hostname + '/publicprofile/' + id).select()
    document.execCommand('copy')
    $temp.remove()
    this.setState({ copied: true })
  }

  layout () {
    this.masonry.layout()
  }

  closeAlert () {
    this.setState({ copied: !this.state.copied })
  }

  render () {
    let { shares } = this.props

    return (
      <Container fluid>
        <Row>
          <SpeechBubble xs='12'>
            <h3>Sök jobb enklare, dela din profil!</h3>
            <p>Här kan du dela din profil med potentiella arbetsgivare. Skapa en delbar länk med ditt wap card, resumé, wap film och körkort.</p>
            <p> Du bestämmer hur länge din länk ska vara delbar genom att bestämma synlighetstiden.</p>

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
                  <Col key={share.id} xs='12' sm='6' md='4' xl='3' className='shareItem'>
                    <Card>
                      <ShareProfileButtons
                        id={share.id}
                        translate={this.props.translate}
                        onRemove={() => this.onRemove(share.id)}
                        onLinkClick={() => this.onLinkClick(share.id)}
                        onCopyClick={() => this.onCopyClick(share.id)}
                      />
                      <CardBlock>
                        <CardTitle>{share.name}</CardTitle>
                        <CardSubtitle>{share.access_count} visningar</CardSubtitle>
                        <Alert isOpen={this.state.copied} toggle={this.closeAlert} color='success'><small>Länk kopierad till klippbordet</small></Alert>
                      </CardBlock>
                    </Card>
                  </Col>
                )
              })}
              {!this.state.loadsave &&
              <Col xs='12' sm='6' md='4' xl='3'>
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

export default withRouter(connect((state) => state)(ShareProfile))
