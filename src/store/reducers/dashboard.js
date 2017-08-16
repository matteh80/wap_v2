const {
  SET_HIDDEN_CARDS,
  GET_HIDDEN_CARDS,
  HIDE_CARD,
  SHOW_CARD
} = require('../actions/actionTypes/dashboard')

const _ = require('lodash')

function dashboard (state = [], action) {
  switch (action.type) {
    case SET_HIDDEN_CARDS:
      return {
        ...state,
        ...action
      }

    case GET_HIDDEN_CARDS:
      return {
        ...state,
        hidden_cards: action.hiddenCards
      }

    case HIDE_CARD:
      if (action.card === undefined) {
        return state
      }
      if (_.includes(state.hidden_cards, action.card)) {
        return state
      }

      let mHiddenCards = Object.assign([], state.hidden_cards)
      mHiddenCards.push(action.card)
      return {
        ...state,
        hidden_cards: mHiddenCards
      }
    default:
      return state
  }
}

export default dashboard
