import React from 'react'
import PropTypes from 'prop-types'

import {
  Col,
  Card,
  CardImgOverlay,
  CardImg,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'

import DashboardButtons from '../../../components/buttons/DashboardButtons'

class RecruiterCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { translate } = this.context
    return (
      <Card>
        <DashboardButtons linkto='/personalrecruiter' card='recruitercard' cardname='Personlig rekryterare' onHide={this.props.onHide} />
        <CardImg src='/img/pers_rekryterare.png' className='img-fluid' />
        <CardImgOverlay className='bg-white' />
        <CardBlock>
          <CardTitle>{translate('recruitercard.title')}</CardTitle>
          <CardSubtitle>{translate('recruitercard.subtitle')}</CardSubtitle>
        </CardBlock>
      </Card>
    )
  }
}
RecruiterCard.contextTypes = {
  translate: PropTypes.func
}

export default RecruiterCard
