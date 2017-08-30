import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { hideCard } from '../../store/actions/dashboard'

import {
  UncontrolledTooltip
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
      this.props.resizable && 'resizable',
      this.props.linkto && 'hasLink'
    )

    return (
      <div className={wrapperClass}>
        <UncontrolledTooltip placement='bottom' target={'followLink' + this.props.card}>
          Gå till sida
        </UncontrolledTooltip>
        <UncontrolledTooltip placement='bottom' target={'hide' + this.props.card}>
          Göm
        </UncontrolledTooltip>
        <div>
          <i className='fa fa-link dashBtn followLink' id={'followLink' + this.props.card} onClick={() => this.goToLink()} />
          {this.props.resizable && <i className='fa fa-expand dashBtn' id='minimize' onClick={() => this.minimize()} />}
          <i className='fa fa-eye-slash dashBtn hide' id={'hide' + this.props.card} onClick={() => this.hide()} />
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
