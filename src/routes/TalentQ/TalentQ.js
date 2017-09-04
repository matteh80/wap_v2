import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { getTestStatus, initiateTest } from '../../store/actions/talentq'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock,
} from 'reactstrap'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'
import ThreeDButton from '../../components/buttons/ThreeDButton'

let dispatch
class TalentQ extends React.Component {
  constructor (props) {
    super(props)
    dispatch = this.props.dispatch

    dispatch(getTestStatus())

    this.handleWindowFocus = this.handleWindowFocus.bind(this)
    this.initiateTest = this.initiateTest.bind(this)
    this.resumeTest = this.resumeTest.bind(this)
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

  initiateTest () {
    let { currentLanguage } = this.context
    dispatch(initiateTest(currentLanguage)).then((result) => {
      console.log(result)
      window.open(this.props.talentq.assessment_url)
    })
  }

  resumeTest () {

  }

  render () {
    let { initiated, completed, assessment_url, result_url } = this.props.talentq

    return (
      <Container fluid>
        {!completed &&
        <Row className='flex-column-reverse flex-lg-row'>
          <Col xs={12} lg={7}>
            <Card>
              <video id='loopvideo' width='100%' height='auto' controls>
                <source src='/img/wap-test_informationsfilm.mp4' type='video/mp4' />
                Your browser do not support this file
              </video>
            </Card>
          </Col>
          <SpeechBubble xs={12} lg={5}>
            <h3>Här får du visa vem du är!</h3>
            <p>Här kommer du att få göra ett unikt online-test som är speciellt framtaget för att du ska få visa vem du
              är,
              och vad just du är bra på. Testet kommer pröva beteende, motivation och personlighet.</p>

            <p>Genom att hjälpa dig att bättre förstå dina egna beteende preferenser och vad du brinner för,
              ökar du chansen betydligt till att nå ditt drömjobb.</p>

            <p>
              <small>Resultatet kommer endast vara tillgängligt för våra rekryterare och eventuella arbetsgivare.
                Det är du som bestämmer om du vill att arbetsgivaren ska få ta del av dina resultat.
              </small>
            </p>
            {!initiated
              ? <ThreeDButton onClick={() => this.initiateTest()}>Ok! Starta testet</ThreeDButton>
              : <ThreeDButton onClick={() => this.resumeTest()}>Jag vill återuppta testet</ThreeDButton>
            }

            {initiated &&
            <p>Länk till testet: <a href={assessment_url}>{assessment_url}</a></p>
            }

          </SpeechBubble>
        </Row>
        }

        {completed &&
        <Row>
          <SpeechBubble xs={12}>
            <h3>Bra jobbat!</h3>
            <p>Du har gjort testet. Här under finner du länk till ditt resultat. Ett mail har även skickats till
              {' ' + this.props.profile.email}</p>
            <p><a href={result_url}>{result_url}</a></p>
            <p>Det här personlighetstestet lyfter fram dina styrkor, vad som driver dig och får dig att trivas på en
              arbetsplats. Testet hjälper dig, eller din personliga rekryterare att hitta rätt jobb för just dig.
              Det är endast du och din eventuella rekryterare som har tillgång till dina resultat.

              Teknisk support: <a href='mailto:technicalsupport@sova.com'>technicalsupport@sova.com</a></p>
          </SpeechBubble>
        </Row>
        }

      </Container>
    )
  }
}

TalentQ.contextTypes = {
  translate: PropTypes.func,
  currentLanguage: PropTypes.string
}
TalentQ.propTypes = {
  dispatch: PropTypes.func,
  talentq: PropTypes.any
}

export default withRouter(connect((state) => state)(TalentQ))
