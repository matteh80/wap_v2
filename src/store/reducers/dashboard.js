const {
  SET_HIDDEN_CARDS,
  GET_HIDDEN_CARDS,
  HIDE_CARD,
  SHOW_CARD,
  UPDATE_CARDS_LIST,
  GET_CARDS_LIST
} = require('../actions/actionTypes/dashboard')

const _ = require('lodash')

function dashboard (state = { hidden_cards: [] }, action) {
  switch (action.type) {
    case SET_HIDDEN_CARDS:
      return {
        ...state,
        ...action
      }

    case GET_HIDDEN_CARDS:
      return {
        ...state,
        hidden_cards: action.hiddenCards ? action.hiddenCards : []
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

      let cards = _.remove(state.cards, function (n) {
        return _.find(cards, { 'name': action.card })
      })
      return {
        ...state,
        hidden_cards: mHiddenCards,
        cards: cards
      }

    case UPDATE_CARDS_LIST:
      return {
        ...state,
        cards: action.cards
      }

    case GET_CARDS_LIST:
      return {
        ...state,
        cards: action.cards ? action.cards : []
      }

    default:
      return state
  }
}

export default dashboard
