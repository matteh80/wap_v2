import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import './PageLayout.scss'
import Sidemenu from '../Sidemenu/Sidemenu'
import Header from '../Header/Header'
import UserIsAuthenticated from '../../routes/auth'
import { connect } from 'react-redux'
import Breadcrumbs from 'react-breadcrumbs'
import { getActiveLanguage, getTranslate } from 'react-localize-redux'
import _ from 'lodash'
import Cookies from 'universal-cookie'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Notifications, { show, success, error, warning, info, hide, removeAll } from 'react-notification-system-redux'

import {
  Container,
} from 'reactstrap'

const cookies = new Cookies()
let hiddenBubbles = []
class PageLayout extends React.Component {
  constructor (props) {
    super(props)

    hiddenBubbles = cookies.get(props.profile.id + '_hiddenBubbles', { path: '/' })

    this.state = {
      helpIconVisible: _.indexOf(hiddenBubbles, props.routing.locationBeforeTransitions.pathname) === -1
    }

    !this.props.profile.tos_accepted && this.props.router.push('/signup')

    this.showHelpBubble = this.showHelpBubble.bind(this)
  }

  componentWillReceiveProps () {
    let { dispatch } = this.props

    if (!navigator.onLine) {
      if (!_.find(this.props.notifications, { uid: 'no-network' })) {
        console.log('should add notification')
        dispatch(warning({
          uid: 'no-network', // you can specify your own uid if required
          title: 'Ingen anslutning',
          message: 'Det finns ingen anslutning till internet. Se till att du är ansluten och uppdatera sedan sidan.',
          autoDismiss: 0,
          position: 'br',
        }))
      }
    } else {
      if (_.find(this.props.notifications, { uid: 'no-network' })) {
        dispatch(hide('no-network'))
      }
    }
  }

  showHelpBubble () {
    let { profile, routing } = this.props
    let { pathname } = routing.locationBeforeTransitions

    hiddenBubbles.push(pathname)
    cookies.set(profile.id + '_hiddenBubbles', hiddenBubbles, { path: '/' })
  }

  render () {
    let { translate, currentLanguage } = this.props
    let activeRouteItem = Object.assign([], this.props.routes).reverse()
    document.title = activeRouteItem[0].name + ' | wap card'

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        translate: translate,
        currentlanguage: currentLanguage
      })
    )

    const { notifications } = this.props

    return (
      <div className='h-100'>
        <ReactCSSTransitionGroup
          transitionName='example'
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnter={false}
          transitionLeave={false}>
          <Header translate={translate} currentLanguage={currentLanguage} />
          <div className='page_wrapper'>
            <Sidemenu translate={translate} />
            <Container fluid className='page-layout__viewport'>
              <Breadcrumbs
                separator={<i className='fa fa-chevron-right' style={{ margin: '0 5px' }} />}
                routes={this.props.routes}
                params={this.props.params}
            />
              {childrenWithProps}
            </Container>
          </div>
          <Notifications
            notifications={notifications}
          />
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  notifications: PropTypes.array
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
  ...state
})

export default UserIsAuthenticated(withRouter(connect(mapStateToProps)(PageLayout)))
