import Cookies from 'universal-cookie'
import _ from 'lodash'

const {
  SET_HIDDEN_CARDS,
  GET_HIDDEN_CARDS,
  HIDE_CARD,
  SHOW_CARD
} = require('./actionTypes/dashboard')

const cookies = new Cookies()

export function setHiddenCardsToCookie () {
  return (dispatch, getState) => {
    let hiddenCards = getState().dashboard.hidden_cards
    cookies.set(getState().profile.id + '_hiddencards', hiddenCards, { path: '/' })
  }
}

export function getHiddenCardsFromCookie () {
  return (dispatch, getState) => {
    let hiddenCardsInCookie = cookies.get(getState().profile.id + '_hiddencards', { path: '/' })
    dispatch({
      type: GET_HIDDEN_CARDS,
      hiddenCards: hiddenCardsInCookie
    })
  }
}

export function hideCard (card, cardname) {
  return (dispatch, getState) => {
    dispatch({
      type: HIDE_CARD,
      card: { card, cardname }
    })
  }
}

export function showCard (card) {
  return (dispatch, getState) => {
    dispatch({
      type: SHOW_CARD,
      card: card
    })
  }
}
