import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { hideCard } from '../../store/actions/dashboard'

import {
  Tooltip
} from 'reactstrap'

class DashboardButtons extends React.Component {
  constructor (props) {
    super(props)

    this.hide = this.hide.bind(this)
    this.minimize = this.minimize.bind(this)
    this.goToLink = this.goToLink.bind(this)
  }

  hide () {
    this.props.onHide()
  }

  minimize () {

  }

  goToLink () {
    this.props.router.push(this.props.linkto)
  }

  render () {
    let wrapperClass = classNames(
      'dashBtnWrapper',
    )

    return (
      <div className={wrapperClass}>
        <div>
          <i className='fa fa-link dashBtn' id='followLink' onClick={() => this.goToLink()} />
          <i className='fa fa-expand dashBtn' id='minimize' onClick={() => this.minimize()} />
          <i className='fa fa-eye-slash dashBtn' id='hide' onClick={() => this.hide()} />
        </div>
      </div>
    )
  }
}

DashboardButtons.propTypes = {
  router: PropTypes.any,
  linkto: PropTypes.string,
}

export default withRouter(connect((state) => state)(DashboardButtons))
