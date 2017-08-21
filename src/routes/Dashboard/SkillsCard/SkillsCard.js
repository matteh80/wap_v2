import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  Card,
  CardImg,
  CardImgOverlay,
  CardBlock,
  CardTitle,
  CardSubtitle
} from 'reactstrap'

import DashboardButtons from '../../../components/buttons/DashboardButtons'

class SkillsCard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { translate } = this.context
    return (
      <Card>
        <DashboardButtons linkto='/work/skills' card='skillscard' cardname='Kompetenser' onHide={this.props.onHide} />
        <CardImg src='/img/test.jpg' className='img-fluid' />
        <CardImgOverlay className='bg-white pt-5'>
          {_.find(this.props.skills, { 'experience': 0 })
            ? <p>Du har en eller flera kompetenser där du inte satt något betyg mellan 1 och 5.</p>
            : <p>Lägg till kompetenser så är det lättare för rekryterare att matcha dig mot jobb.</p>
          }
        </CardImgOverlay>
        <CardBlock>
          <CardTitle>Kompetenser</CardTitle>
          <CardSubtitle>Betygsätt dina kompetenser</CardSubtitle>
        </CardBlock>
      </Card>
    )
  }
}

SkillsCard.contextTypes = {
  translate: PropTypes.func
}

export default SkillsCard
