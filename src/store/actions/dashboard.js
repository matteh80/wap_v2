import Cookies from 'universal-cookie'
import _ from 'lodash'

const {
  SET_HIDDEN_CARDS,
  GET_HIDDEN_CARDS,
  HIDE_CARD,
  SHOW_CARD,
  UPDATE_CARDS_LIST,
  GET_CARDS_LIST
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

export function hideCard (card) {
  return (dispatch, getState) => {
    dispatch({
      type: HIDE_CARD,
      card: card
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

export function updateCardsList (list) {
  let mNameArray = []
  list.map((item) => {
    mNameArray.push(item.name)
  })
  return (dispatch, getState) => {
    cookies.set(getState().profile.id + '_cards', mNameArray, { path: '/' })
    dispatch({
      type: UPDATE_CARDS_LIST,
      cards: mNameArray
    })
  }
}

export function getCardsList () {
  return (dispatch, getState) => {
    let mCards = cookies.get(getState().profile.id + '_cards', { path: '/' })
    dispatch({
      type: GET_CARDS_LIST,
      cards: mCards
    })
  }
}
