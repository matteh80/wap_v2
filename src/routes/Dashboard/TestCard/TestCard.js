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
      <Card>
        <DashboardButtons linkto='/personalitytest' card='testcard' cardname='Personlighetstest' onHide={this.props.onHide} />
        <CardImg src='/img/test.png' className='img-fluid' />
        <CardImgOverlay className='bg-white' />
        <CardBlock>
          <CardTitle>{translate('testcard.title')}</CardTitle>
          <CardSubtitle>TalentQ</CardSubtitle>
        </CardBlock>
      </Card>
    )
  }
}

TestCard.contextTypes = {
  translate: PropTypes.func
}

export default TestCard
