import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import PropTypes from 'prop-types'
import { syncHistoryWithStore } from 'react-router-redux'
import { getActiveLanguage, getTranslate } from 'react-localize-redux'
import CookieBanner from 'react-cookie-banner'
import ReactGA from 'react-ga'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    translate: PropTypes.func,
    currentLanguage: PropTypes.string
  }

  constructor (props) {
    super(props)
    const browser = require('detect-browser')
    console.log(browser)
    ReactGA.initialize('UA-100067149-2')
  }

  shouldComponentUpdate () {
    return false
  }

  getChildContext () {
    return {
      translate: this.props.translate,
      currentLanguage: this.props.currentLanguage
    }
  }

  logPageView () {
    console.log('log page view')
    ReactGA.set({ page: window.location.pathname + window.location.search })
    ReactGA.pageview(window.location.pathname + window.location.search)
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
  translate: PropTypes.func,
  currentLanguage: PropTypes.string
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer).code,
  ...state
})

export default connect(mapStateToProps)(App)
