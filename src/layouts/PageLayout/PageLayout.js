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

import { login, socialLogin } from '../../store/actions/auth'
import { getProfile, updateProfile } from '../../store/actions/profile'
import { getAllEmployments, createEmployment } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'
import { getAllOccupations, getMyOccupations } from '../../store/actions/occupations'
import { getAllSkills, getMySkills } from '../../store/actions/skills'
import { getAllLanguages, getMyLanguages } from '../../store/actions/languages'
import { getAllMotivations, getMyMotivations } from '../../store/actions/motivations'
import { getAllPersonalities, getMyPersonalities } from '../../store/actions/personalities'
import { getVideoInfo } from '../../store/actions/wapfilm'
import { getAllLicenses, getMyLicenses } from '../../store/actions/drivinglicenses'
import { getAllReferences } from '../../store/actions/references'
import { getAllQuestions } from '../../store/actions/dreamjob'
import { getAllLocations } from '../../store/actions/locations'
import { getTestStatus } from '../../store/actions/talentq'

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
          message: 'Det finns ingen anslutning till internet. Se till att du har anslutning innan du fortsätter.',
          autoDismiss: 0,
          position: 'br',
        }))
      }
    } else {
      if (_.find(this.props.notifications, { uid: 'no-network' })) {
        dispatch(hide('no-network'))
        Promise.all([
          dispatch(getAllEmployments()),
          dispatch(getAllEducations()),
          dispatch(getAllOccupations()),
          dispatch(getMyOccupations()),
          dispatch(getAllSkills()),
          dispatch(getMySkills()),
          dispatch(getAllLanguages()),
          dispatch(getMyLanguages()),
          dispatch(getAllMotivations()),
          dispatch(getMyMotivations()),
          dispatch(getAllPersonalities()),
          dispatch(getMyPersonalities()),
          dispatch(getVideoInfo()),
          dispatch(getAllLicenses()),
          dispatch(getMyLicenses()),
          dispatch(getAllReferences()),
          dispatch(getAllQuestions()),
          dispatch(getAllLocations()),
          dispatch(getTestStatus()),
        ]).then(() => {
          console.log('fetched everything')
        })
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
    document.title = activeRouteItem[0].name + ' | WAP - work and passion'

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
