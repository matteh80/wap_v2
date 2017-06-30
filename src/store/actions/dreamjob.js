import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  DREAMJOB_FAIL,
  GET_QUESTIONS,
  SAVE_QUESTIONS
} = require('./actionTypes/dreamjob')

export function getAllQuestions () {
  return (dispatch, getState) => {
    return axios.all([getQuestions(), getAnswers()])
      .then(axios.spread(function (questions, answers) {
        dispatch({
          type: GET_QUESTIONS,
          questions: questions.data,
          answers: answers.data,
          receivedAt: Date.now()
        })
      }))
  }
}

export function saveQuestions (answers) {
  return (dispatch) => {
    return apiClient.post('me/questions', answers)
      .then((result) => {
        console.log(result)
        return dispatch(getAllQuestions())
      })
  }
}

function getQuestions () {
  return apiClient.get('/questions')
}

function getAnswers () {
  return apiClient.get('/me/questions')
}
