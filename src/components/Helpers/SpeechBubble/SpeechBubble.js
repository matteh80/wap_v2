import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './SpeechBubble.scss'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'
import _ from 'lodash'

import {
  Col,
  Card,
  CardBlock
} from 'reactstrap'

const cookies = new Cookies()
let hiddenBubbles = []
class SpeechBubble extends React.Component {
  constructor (props) {
    super(props)

    // cookies.remove(props.profile.id + '_hiddenBubbles', { path: '/' })

    hiddenBubbles = cookies.get(props.profile.id + '_hiddenBubbles', { path: '/' })
    if (!hiddenBubbles) {
      hiddenBubbles = []
    }

    this.state = {
      bubbleHidden: _.indexOf(hiddenBubbles, props.routing.locationBeforeTransitions.pathname) > -1
    }

    this.hideSpeechbubble = this.hideSpeechbubble.bind(this)
    this.showHelpBubble = this.showHelpBubble.bind(this)
  }

  hideSpeechbubble () {
    let { profile, routing } = this.props
    let { pathname } = routing.locationBeforeTransitions
    if (_.indexOf(hiddenBubbles, pathname) === -1) {
      hiddenBubbles.push(pathname)
      cookies.set(profile.id + '_hiddenBubbles', hiddenBubbles, { path: '/' })

      this.setState({
        bubbleHidden: true
      })
    }
  }

  showHelpBubble () {
    let { profile, routing } = this.props
    let { pathname } = routing.locationBeforeTransitions

    console.log(hiddenBubbles)
    let index = _.indexOf(hiddenBubbles, pathname)
    console.log(index)

    if (index > -1) {
      hiddenBubbles.splice(index, 1)
      cookies.set(profile.id + '_hiddenBubbles', hiddenBubbles, { path: '/' })
      this.setState({
        bubbleHidden: false
      })
    }
  }

  render () {
    let { xs, sm, md, lg, xl } = this.props
    let arrowClass = classNames('speechBubble', this.props.pos, this.props.className)
    let bubbleClass = classNames('bubbleWrapper', this.props.pos)
    let hideClass = classNames('hideshow justify-content-center align-items-center', this.props.hideable ? 'd-flex' : 'd-none')
    let helpClass = classNames(
      'fa fa-question-circle helpIcon',
      this.state.bubbleHidden && 'visible'
    )

    let mProps = {}
    if (!this.state.bubbleHidden) {
      mProps = {
        xs: xs,
        sm: sm,
        md: md,
        lg: lg,
        xl: xl
      }
    }
    let mClass = classNames(
      this.state.bubbleHidden && 'flexGrowZero'
    )

    return (
      <Col {...mProps} className={mClass}>
        {this.state.bubbleHidden
          ? <i className={helpClass} id='helpIcon' onClick={() => this.showHelpBubble()} />
          : <div className={bubbleClass}>
            <div className='bubble'>
              <Card className={arrowClass}>
                <div className={hideClass}>
                  <i className='fa fa-times' onClick={() => this.hideSpeechbubble()} />
                </div>
                <CardBlock>
                  {this.props.children}
                </CardBlock>
              </Card>
            </div>
            <div className='gubbe'>
              <img src='/img/helper_male_new.png' className='gubbe img-fluid' />
            </div>
          </div>
        }
      </Col>
    )
  }
}

SpeechBubble.propTypes = {
  children: PropTypes.node,
  pos: PropTypes.string,
  hideable: PropTypes.bool
}

export default withRouter(connect((state) => state)(SpeechBubble))
