const {
  SKILLS_FAIL,
  GET_ALL_SKILLS,
  GET_MY_SKILLS,
  ADD_SKILL,
  REMOVE_SKILL,
  SAVE_SKILLS
} = require('../actions/actionTypes/skills')

function skills (state = [], action) {
  if (action.error) {
    return {
      result: state.result,
      error: action.error
    }
  }
  switch (action.type) {
    case GET_ALL_SKILLS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case GET_MY_SKILLS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case ADD_SKILL:
      return Object.assign({}, state, {
        userSkills: [
          ...state.userSkills,
          {
            id: action.skill.id,
            name: action.skill.name,
            parent_name: action.skill.parent_name
          }
        ]
      })

    case REMOVE_SKILL:
      console.log(action)
      console.log(state)
      return {
        userSkills: state.userSkills.filter(userSkills => userSkills.id !== action.id)
      }

    case SAVE_SKILLS:
      return {
        ...state,
        receivedAt: action.receivedAt,
        ...action
      }

    case SKILLS_FAIL:
      return {
        ...action
      }
    default:
      return state
  }
}

export default skills
