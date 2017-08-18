import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './SpeechBubble.scss'

import {
  Row,
  Col,
  Collapse,
  Card,
  CardBlock
} from 'reactstrap'

class SpeechBubble extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let arrowClass = classNames('speechBubble', this.props.pos, this.props.className)
    let bubbleClass = classNames('bubbleWrapper', this.props.pos)

    return (
      <div className={bubbleClass}>
        <div className='bubble'>
          <Card className={arrowClass}>
            <CardBlock>
              {this.props.children}
            </CardBlock>
          </Card>
        </div>
        <div className='gubbe'>
          <img src='/img/helper_male.png' className='gubbe img-fluid' />
        </div>
      </div>
    )
  }
}

SpeechBubble.propTypes = {
  children: PropTypes.node,
  pos: PropTypes.string
}

export default SpeechBubble
