import React from 'react'
import DashboardButtons from '../../../components/buttons/DashboardButtons'

import {
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

    this.onHide = this.onHide.bind(this)
  }

  onHide () {
    this.props.onHide()
  }

  render () {
    return (
      <Card>
        <DashboardButtons linkto='/wapfilm' onHide={() => this.onHide()} />
        <CardImg src='/img/video.jpg' className='img-fluid' />
        <CardImgOverlay className='bg-white' />
        <CardBlock>
          <CardTitle>Wap film</CardTitle>
          <CardSubtitle>Ladda upp en film</CardSubtitle>
        </CardBlock>
      </Card>
    )
  }
}

export default WapfilmCard
