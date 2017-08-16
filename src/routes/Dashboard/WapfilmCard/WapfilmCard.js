import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import DashboardButtons from '../../../components/buttons/DashboardButtons'

import {
  Col,
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardImgOverlay
} from 'reactstrap'

class WapfilmCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Col xs={12} sm={6} lg={4} xl={3}>
        <Card>
          <DashboardButtons linkto='/wapfilm' card='wapfilmcard' cardname='Wap film' />
          <CardImg src='/img/video.jpg' className='img-fluid' />
          <CardImgOverlay className='bg-white' />
          <CardBlock>
            <CardTitle>Wap film</CardTitle>
            <CardSubtitle>Ladda upp en film</CardSubtitle>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export default withRouter(connect((state) => state)(WapfilmCard))
