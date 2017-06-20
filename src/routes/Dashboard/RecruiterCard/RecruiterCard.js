import React from 'react'

import {
  Card,
  CardText,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class RecruiterCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
    <Card>
      <div className='card-bg' style={{ background: '#f97474 url("img/recruiter_graphics.png")' }} />
      <CardBlock>
        <CardTitle>Personlig rekryterare</CardTitle>
        <CardSubtitle>Din hjälp till drömjobbet</CardSubtitle>
        <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam lorem et ligula finibus, a euismod dolor posuere. Praesent et enim at eros tristique interdum. Praesent volutpat non velit vel bibendum.</CardText>
        <ThreeDButton small>Starta testet</ThreeDButton>
      </CardBlock>
    </Card>
    )
  }
}

export default RecruiterCard
