const version = require('../../../public/appversion.json')
export default function appversion (state = { appversion: version }, action) {
  return state
}