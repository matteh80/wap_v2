import React from 'react'

import {
  Card,
  CardText,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class TestCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Card style={{ background: '#ffd55c url("img/test_graphics.png")' }}>
        <CardBlock>
          <CardTitle>Personlighetstest</CardTitle>
          <CardSubtitle>TalentQ</CardSubtitle>
          <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam lorem et ligula finibus, a euismod dolor posuere. Praesent et enim at eros tristique interdum. Praesent volutpat non velit vel bibendum.</CardText>
          <ThreeDButton small>Starta testet</ThreeDButton>
        </CardBlock>
      </Card>
    )
  }
}

export default TestCard
