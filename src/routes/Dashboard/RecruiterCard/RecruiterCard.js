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
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card>
          <DashboardButtons linkto='/personalrecruiter' card='recruitercard' cardname='Personlig rekryterare' />
          <CardImg src='/img/recruiter.jpg' className='img-fluid' />
          <CardImgOverlay className='bg-white' />
          <CardBlock>
            <CardTitle>{translate('recruitercard.title')}</CardTitle>
            <CardSubtitle>{translate('recruitercard.subtitle')}</CardSubtitle>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}
RecruiterCard.contextTypes = {
  translate: PropTypes.func
}

export default RecruiterCard
