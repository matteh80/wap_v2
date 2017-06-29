import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { addTranslation, setLanguages, setActiveLanguage, getActiveLanguage, getTranslate } from 'react-localize-redux'
import $ from 'jquery'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  constructor (props) {
    super (props)

    let { dispatch } = this.props
    const globalJson = require('../assets/global.locale.json')
    const profileJson = require('../assets/profile.locale.json')
    const json = $.extend(globalJson, profileJson)

    dispatch(setLanguages(['sv', 'en']))
    dispatch(setActiveLanguage(this.props.currentLanguage))
    dispatch(addTranslation(json))
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    // Create an enhanced history that syncs navigation events with the store
    const history = syncHistoryWithStore(browserHistory, this.props.store)

    return (
      <Provider store={this.props.store}>
        <Router history={history} children={this.props.routes} translate={this.props.translate} />
      </Provider>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.localeReducer),
  currentLanguage: getActiveLanguage(state.localeReducer) ? getActiveLanguage(state.localeReducer).code : 'sv',
  ...state
})

export default connect(mapStateToProps)(App)

const colors = {
  blue: '#248fb8'
}
