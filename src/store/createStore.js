import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
// import makeRootReducer from './reducers'
import rootReducer from './reducers'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const routingMiddleware = routerMiddleware(browserHistory)
  const middleware = [thunk, routingMiddleware]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [autoRehydrate()]

  let composeEnhancers = compose

  if (__DEV__) {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  return new Promise((resolve, reject) => {
    try {
      const store = createReduxStore(
        rootReducer,
        initialState,
        composeEnhancers(
          applyMiddleware(...middleware),
          ...enhancers
        )
      )
      store.asyncReducers = {}

      const persistor = persistStore(store,
        { storage: asyncSessionStorage }, () => resolve(store))

      if (module.hot) {
        module.hot.accept('./reducers', () => {
          const reducers = require('./reducers').default
          store.replaceReducer(reducers(store.asyncReducers))
        })
      }
      return store
    } catch (e) {
      reject(e)
    }
  })

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  // store.unsubscribeHistory = browserHistory.listen(updateLocation(store))
}

// export default createStore
