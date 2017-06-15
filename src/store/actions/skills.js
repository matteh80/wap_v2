import { apiClient } from '../axios.config'
import axios from 'axios'

const {
  SKILLS_FAIL,
  GET_ALL_SKILLS,
  GET_MY_SKILLS,
  ADD_SKILL,
  REMOVE_SKILL,
  SAVE_SKILLS
} = require('./actionTypes/skills')

export function getAllSkills () {
  return (dispatch, getState) => {
    return apiClient.get('skills').then((result) => {
      return dispatch({
        type: GET_ALL_SKILLS,
        skills: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: SKILLS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}

export function getMySkills () {
  return (dispatch, getState) => {
    return apiClient.get('me/skills')
      .then((result) => {
        return dispatch({
          type: GET_MY_SKILLS,
          userSkills: result.data,
          receivedAt: Date.now()
        })

      })
  }
}

export function removeSkill (id) {
  return {
    type: REMOVE_SKILL,
    id: id
  }
}

export function addSkill (skill) {
  return {
    type: ADD_SKILL,
    skill: skill
  }
}

export function saveSkillsToServer (skills) {
  console.log(skills)
  return (dispatch, getState) => {
    return apiClient.post('me/skills/', skills).then((result) => {
      console.log(result)
      return dispatch({
        type: SAVE_SKILLS,
        userSkills: result.data,
        receivedAt: Date.now()
      })
    })
      .catch(function (error) {
        return dispatch({
          type: SKILLS_FAIL,
          error: error.text,
          receivedAt: Date.now()
        })
      })
  }
}
