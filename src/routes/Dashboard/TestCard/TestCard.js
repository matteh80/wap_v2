import React from 'react'

import {
  Card,
  CardImg,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'
import ThreeDButton from '../../../components/buttons/ThreeDButton'

class TestCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Card>
        <div style={{ background: '#ffd55c', padding: '0 20%' }}>
          <CardImg top src='img/test_graphics.png' className='img-fluid' alt='Personlighetstest' />
        </div>
        <CardBlock>
          <CardTitle>Personlighetstest</CardTitle>
          <CardSubtitle>TalentQ</CardSubtitle>
          <ThreeDButton small>Starta testet</ThreeDButton>
        </CardBlock>
      </Card>
    )
  }
}

export default TestCard
