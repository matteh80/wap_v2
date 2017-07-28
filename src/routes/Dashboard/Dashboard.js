import React from 'react'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-component'
import Cookies from 'universal-cookie'

import TestCard from './TestCard/TestCard'

import {
  Row,
  Col,
  Card,
  CardBlock
} from 'reactstrap'
import RecruiterCard from './RecruiterCard/RecruiterCard'
import JobsCard from './JobsCard/JobsCard'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick (e) {
    console.log(e)
  }

  render () {
    let style = {
      display: 'flex'
    }

    let { translate } = this.props
    let cookies = new Cookies()
    let allSavedJobs = this.props.jobs.savedJobs


    return (
      <Masonry
        options={masonryOptions}
        onClick={this.handleClick}
        style={style}
        ref={function (c) { this.masonry = this.masonry || c.masonry }.bind(this)}
      >
        {this.props.jobs && this.props.jobs.savedJobs && allSavedJobs.length > 0 &&
        <Col xs={12} sm={6} lg={4} xl={3}>
          <JobsCard translate={translate} jobs={allSavedJobs} />
        </Col>
        }

        <Col xs={12} sm={6} lg={4} xl={3}>
          <TestCard translate={translate} />
        </Col>

        <Col xs={12} sm={6} lg={4} xl={3}>
          <RecruiterCard translate={translate} />
        </Col>

      </Masonry>
    )
  }
}

export default connect((state) => state)(Dashboard)

const masonryOptions = {
  transitionDuration: 500
}
