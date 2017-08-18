import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import {
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

    return (
      <Card className={arrowClass}>
        <CardBlock>
          {this.props.children}
        </CardBlock>
      </Card>
    )
  }
}

SpeechBubble.propTypes = {
  children: PropTypes.node,
  pos: PropTypes.string
}

export default SpeechBubble
