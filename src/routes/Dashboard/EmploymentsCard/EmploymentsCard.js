import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getAllEmployments } from '../../../store/actions/employments'

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

class EmploymentsCard extends React.Component {
  constructor (props) {
    super(props)

    let { dispatch } = this.props
    dispatch(getAllEmployments())
  }

  render () {
    let employmentCount = this.props.employments.employments && this.props.employments.employments.length
    let { translate } = this.context

    return (
      <Card>
        <DashboardButtons linkto='/work/employments' card='employmentscard' cardname='Anställningar' onHide={this.props.onHide} />
        <CardImg src='/img/anstallningar.png' className='img-fluid' />
        <CardImgOverlay className='bg-white'>
          <CardText>{translate('employmentscard.title')}</CardText>
        </CardImgOverlay>
        <CardBlock>
          <CardTitle>{translate('employmentscard.title')}</CardTitle>
          {employmentCount === 0
          ? <CardSubtitle>{translate('employmentscard.subtitle_empty')}</CardSubtitle>
          : <CardSubtitle>{translate('employmentscard.subtitle_add_more')}</CardSubtitle>
        }
        </CardBlock>
      </Card>
    )
  }
}

EmploymentsCard.contextTypes = {
  translate: PropTypes.func,
  currentLanguage: PropTypes.string
}

export default withRouter(connect((state) => state)(EmploymentsCard))
