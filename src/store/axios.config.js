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

export const apiClient = instance
