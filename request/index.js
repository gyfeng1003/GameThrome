import axios from 'axios'

axios.defaults.baseURL = ''
axios.defaults.timeout = 10000

axios.interceptors.request.use(config=>{
  config.headers = {
    'x-session': '11'
  }
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(({ config, data })=>{
  return data
}, err => {
  return Promise.reject(err)
})

export default axios