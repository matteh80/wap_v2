const {
  GET_ALL_JOBS,
  SAVE_JOB
} = require('../actions/actionTypes/jobs')

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
        let index = state.savedJobs.findIndex(savedJobs => savedJobs.id === action.jobtoSave.id)
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

    default:
      return state
  }
}

export default jobs
