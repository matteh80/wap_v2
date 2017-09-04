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

class DreamjobCard extends React.Component {
  render () {
    let { translate } = this.context
    return (
      <Card>
        <DashboardButtons linkto='/passion/dreamjob' card='dreamjobcard' cardname='Personlighetstest' onHide={this.props.onHide} />
        <CardImg src='/img/dromjobb.png' className='img-fluid' />
        <CardImgOverlay className='bg-white' />
        <CardBlock>
          <CardTitle>{translate('dreamjobcard.title')}</CardTitle>
          <CardSubtitle>{translate('dreamjobcard.subtitle_only_dreamjob')}</CardSubtitle>
        </CardBlock>
      </Card>
    )
  }
}

DreamjobCard.contextTypes = {
  translate: PropTypes.func
}

export default DreamjobCard
