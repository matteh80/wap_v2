import React from 'react'
import PropTypes from 'prop-types'

import {
  Col,
  Card,
  CardImg,
  CardImgOverlay,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'

import DashboardButtons from '../../../components/buttons/DashboardButtons'

class TestCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { translate } = this.context
    return (
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card>
          <DashboardButtons linkto='/personalitytest' card='testcard' cardname='Personlighetstest' />
          <CardImg src='/img/test.jpg' className='img-fluid' />
          <CardImgOverlay className='bg-white' />
          <CardBlock>
            <CardTitle>{translate('testcard.title')}</CardTitle>
            <CardSubtitle>TalentQ</CardSubtitle>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

TestCard.contextTypes = {
  translate: PropTypes.func
}

export default TestCard
