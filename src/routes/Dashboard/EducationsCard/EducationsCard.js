import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import {
  Col,
  Card,
  CardText,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardImgOverlay
} from 'reactstrap'
import DashboardButtons from '../../../components/buttons/DashboardButtons'

class EducationsCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { translate } = this.context
    let educationCount = this.props.educations.educations.length

    return (
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card>
          <DashboardButtons linkto='/work/educations' card='educationscard' cardname='Utbildningar' />
          <CardImg src='/img/education.jpg' className='img-fluid' />
          <CardImgOverlay className='bg-white'>
            <CardText>{translate('educationscard.title')}</CardText>
          </CardImgOverlay>
          <CardBlock>
            <CardTitle>{translate('educationscard.title')}</CardTitle>
            {educationCount === 0
            ? <CardSubtitle>{translate('educationscard.subtitle_empty')}</CardSubtitle>
            : <CardSubtitle>{translate('educationscard.subtitle_add_more')}</CardSubtitle>
          }
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

EducationsCard.contextTypes = {
  translate: PropTypes.func,
  currentLanguage: PropTypes.string
}

export default withRouter(connect((state) => state)(EducationsCard))
