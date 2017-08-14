import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTestStatus } from '../../store/actions/talentq'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
} from 'reactstrap'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

let dispatch
class TalentQ extends React.Component {

  constructor (props) {
    super(props)
    dispatch = this.props.dispatch

    dispatch(getTestStatus())

    this.handleWindowFocus = this.handleWindowFocus.bind(this)
  }

  componentDidMount () {
    window.addEventListener('focus', this.handleWindowFocus)
  }

  componentWillUnmount () {
    window.removeEventListener('focus', this.handleWindowFocus)
  }

  handleWindowFocus () {
    console.log('focus')
    dispatch(getTestStatus())
  }

  render () {

    return (
      <Container fluid>
        <Row className='flex-column-reverse flex-lg-row'>
          <Col xs={12} lg={7}>
            <Card>
              <video id='loopvideo' width='100%' height='auto' controls>
                <source src='/img/wap-test_informationsfilm.mp4' type='video/mp4' />
                Your browser do not support this file
              </video>
            </Card>
          </Col>
          <SpeechBubble pos='left-side top'>
            Här kommer du att få göra ett unikt online-test som är speciellt framtaget för att du ska få visa vem du är, och vad just du är bra på. Testet kommer pröva beteende, motivation och personlighet.

            Genom att hjälpa dig att bättre förstå dina egna beteende preferenser och vad du brinner för, ökar du chansen betydligt till att nå ditt drömjobb.
          </SpeechBubble>
        </Row>
      </Container>
    )
  }
}

TalentQ.propTypes = {
  dispatch: PropTypes.func
}

export default connect((state) => state)(TalentQ)
