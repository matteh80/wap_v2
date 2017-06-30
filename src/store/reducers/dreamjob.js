const {
  DREAMJOB_FAIL,
  GET_QUESTIONS,
  SAVE_QUESTIONS
} = require('../actions/actionTypes/dreamjob')

function dreamjob (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_QUESTIONS:
      let mQuestions = []
      action.questions.map((question, index) => {
        let mQuestion = Object.assign({}, question, { answer: action.answers[index].answer })
        mQuestions.push(mQuestion)
      })
      return {
        ...state,
        ...mQuestions
      }

    case DREAMJOB_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default dreamjob
