import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { getActiveLanguage, getTranslate } from 'react-localize-redux'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  constructor (props) {
    super (props)

    let { dispatch } = this.props
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
  currentLanguage: getActiveLanguage(state.localeReducer).code,
  ...state
})

export default connect(mapStateToProps)(App)

const colors = {
  blue: '#248fb8'
}
