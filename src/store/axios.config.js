import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

let instance = axios.create()
instance.defaults.baseURL = 'https://api.wapcard.se/api/v1/'
instance.defaults.timeout = 60000
if (cookies.get('token')) {
  instance.defaults.headers = {
    'Authorization': 'Token ' + cookies.get('token')
  }
}

instance.interceptors.request.use((config) => {
  if (config.url[config.url.length - 1] !== '/') {
    config.url += '/'
  }
  return config
})

export const apiClient = instance
