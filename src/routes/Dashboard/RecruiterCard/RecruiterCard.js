import React from 'react'

import {
  Card,
  CardImg,
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
        <div style={{ background: '#f97474', padding: '0 20%' }}>
          <CardImg top src='img/recruiter_graphics.png' className='img-fluid' alt='Personlighetstest' />
        </div>
        <CardBlock>
          <CardTitle>Personlig rekryterare</CardTitle>
          <CardSubtitle>Ansök du om en personlig rekryterare</CardSubtitle>
          <ThreeDButton small>Personlig rekryterare</ThreeDButton>
        </CardBlock>
      </Card>
    )
  }
}

export default RecruiterCard
