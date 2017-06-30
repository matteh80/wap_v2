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
    let { translate } = this.props
    return (
      <Card style={{ background: '#ffd55c url("img/test_graphics.png")' }}>
        <CardBlock>
          <CardTitle>{translate('testcard.title')}</CardTitle>
          <CardSubtitle>TalentQ</CardSubtitle>
          <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam lorem et ligula finibus, a euismod dolor posuere. Praesent et enim at eros tristique interdum. Praesent volutpat non velit vel bibendum.</CardText>
          <ThreeDButton className='btn-white' small>{translate('testcard.start_test')}</ThreeDButton>
        </CardBlock>
      </Card>
    )
  }
}

export default TestCard
