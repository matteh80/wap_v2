const {
  GET_ALL_JOBS,
  SAVE_JOB,
  REMOVE_JOB
} = require('../actions/actionTypes/jobs')

let index = -1

function jobs (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_JOBS:
      return {
        ...state,
        ...action
      }

    case SAVE_JOB:
      let mArray
      console.log(state)
      if (state.savedJobs) {
        index = state.savedJobs.findIndex(savedJobs => savedJobs.id === action.jobtoSave.id)
        console.log(index)
        if (index > -1) return state
        mArray = Object.assign([], state.savedJobs)
      } else {
        mArray = []
      }

      return {
        ...state,
        savedJobs: [...mArray, action.jobtoSave]
      }

    case REMOVE_JOB:
      index = state.savedJobs.findIndex(savedJobs => savedJobs.id === action.jobtoRemove.id)
      console.log(index)
      if (index === -1) return state

      return {
        savedJobs: [
          ...state.savedJobs.slice(0, index),
          ...state.savedJobs.slice(index + 1)
        ],
      }

    default:
      return state
  }
}

export default jobs
