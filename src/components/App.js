import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { syncHistoryWithStore } from 'react-router-redux'
import Sidemenu from '../layouts/Sidemenu/Sidemenu'
import Header from '../layouts/Header/Header'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    // Create an enhanced history that syncs navigation events with the store
    const history = syncHistoryWithStore(browserHistory, this.props.store)

    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={this.props.routes} />
        </div>
      </Provider>
    )
  }
}

export default App

const colors = {
  blue: '#248fb8'
}
