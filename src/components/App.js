import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import PropTypes from 'prop-types'
import { syncHistoryWithStore } from 'react-router-redux'
import { getActiveLanguage, getTranslate } from 'react-localize-redux'
import CookieBanner from 'react-cookie-banner'
import ReactGA from 'react-ga'
import $ from 'jquery'

let Raven = require('raven-js')

Raven.config('https://9e381a0287464529af7a8a88edc27c9b@sentry.io/210938', {
  release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
}).install()

let breakpoint = {}
class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    translate: PropTypes.func,
    currentLanguage: PropTypes.string,
  }

  constructor (props) {
    super(props)
    ReactGA.initialize('UA-100067149-2')

    breakpoint.refreshValue = function () {
      this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '')
    }

    $(window).resize(function () {
      breakpoint.refreshValue()
    }).resize()

    this.getBreakpoint = this.getBreakpoint.bind(this)
  }

  getBreakpoint () {
    return breakpoint.value
  }

  shouldComponentUpdate () {
    return false
  }

  getChildContext () {
    return {
      profile: this.props.profile,
      translate: this.props.translate,
      currentLanguage: this.props.currentLanguage,
      getBreakpoint: this.getBreakpoint
    }
  }

  logPageView () {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'development') {
      ReactGA.set({ page: window.location.pathname + window.location.search })
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }

  render () {
    // Create an enhanced history that syncs navigation events with the store
    const history = syncHistoryWithStore(browserHistory, this.props.store)
    let { translate } = this.props

    return (
      <div>
        <CookieBanner
          message={translate('cookies.cookies_consent_msg')}
          buttonMessage={translate('cookies.btn_msg')}
          onAccept={() => {}}
          cookie='user-has-accepted-cookies'
          dismissOnScroll={false} />
        <Provider store={this.props.store}>
          <Router history={history} children={this.props.routes} onUpdate={this.logPageView} />
        </Provider>
      </div>
    )
  }
}

App.childContextTypes = {
  profile: PropTypes.object,
  translate: PropTypes.func,
  currentLanguage: PropTypes.string,
  getBreakpoint: PropTypes.func
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer).code,
  ...state
})

export default connect(mapStateToProps)(App)
