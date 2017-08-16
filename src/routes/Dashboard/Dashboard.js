import React from 'react'
import { connect } from 'react-redux'
import { setHiddenCardsToCookie } from '../../store/actions/dashboard'
import Masonry from 'react-masonry-component'
import Cookies from 'universal-cookie'

import TestCard from './TestCard/TestCard'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import RecruiterCard from './RecruiterCard/RecruiterCard'
import JobsCard from './JobsCard/JobsCard'
import EducationsCard from './EducationsCard/EducationsCard'
import EmploymentsCard from './EmploymentsCard/EmploymentsCard'
import WapfilmCard from './WapfilmCard/WapfilmCard'

const _ = require('lodash')

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this._handleClick = this._handleClick.bind(this)
  }

  componentWillReceiveProps (newProps) {
    let { dispatch } = this.props
    if (newProps.dashboard.hidden_cards.length !== this.props.dashboard.hidden_cards) {
      dispatch(setHiddenCardsToCookie())
    }
  }

  _handleClick (e) {
    console.log(e)
  }

  render () {
    let style = {
      display: 'flex'
    }

    let cookies = new Cookies()
    let allSavedJobs = this.props.jobs.savedJobs
    let { hidden_cards } = this.props.dashboard

    return (
      <Container fluid>
        <Masonry
          options={masonryOptions}
          onClick={this.handleClick}
          style={style}
          ref={function (c) { this.masonry = this.masonry || c.masonry }.bind(this)}
        >
          {this.props.jobs && this.props.jobs.savedJobs && allSavedJobs.length > 0 &&
            <JobsCard jobs={allSavedJobs} />
          }

          {_.findIndex(hidden_cards, { 'card' : 'testcard' }) === -1 &&
          <TestCard />
          }

          {_.findIndex(hidden_cards, { 'card' : 'recruitercard' }) === -1 &&
          <RecruiterCard />
          }

          {_.findIndex(hidden_cards, { 'card' : 'educationscard' }) === -1 &&
          <EducationsCard />
          }

          {_.findIndex(hidden_cards, { 'card' : 'employmentscard' }) === -1 &&
          <EmploymentsCard />
          }

          {_.findIndex(hidden_cards, { 'card' : 'wapfilmcard' }) === -1 && !this.props.wapfilm.video &&
          <WapfilmCard />
          }

        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Dashboard)

const masonryOptions = {
  transitionDuration: 500
}
