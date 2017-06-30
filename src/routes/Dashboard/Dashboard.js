import React from 'react'
import Masonry from 'react-masonry-component'

import TestCard from './TestCard/TestCard'

import {
  Row,
  Col,
  Card,
  CardBlock
} from 'reactstrap'
import RecruiterCard from './RecruiterCard/RecruiterCard'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick (e) {
    console.log(e)
  }

  render () {
    let style = {
      display: 'flex'
    }

    let { translate } = this.props

    return (
      <Masonry
        options={masonryOptions}
        onClick={this.handleClick}
        style={style}
        ref={function (c) { this.masonry = this.masonry || c.masonry }.bind(this)}
      >

        <Col xs={12} sm={6} lg={4} xl={3}>
          <TestCard translate={translate} />
        </Col>

        <Col xs={12} sm={6} lg={4} xl={3}>
          <RecruiterCard translate={translate} />
        </Col>

      </Masonry>
    )
  }
}

const masonryOptions = {
  transitionDuration: 500
}
