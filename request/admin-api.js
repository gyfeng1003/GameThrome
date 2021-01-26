
import axios from '~/request'
export default {
  // 扫码登陆
  qrcode() {
    return axios.get('/login/ercode')
  },
  getTokenUser(qrcode) {
    return axios.get(`/login/errcode/check/${qrcode}`)
  },
  authCheck(param, config) {
    return axios({
      method: 'GET',
      url: '/my',
      params: param,
      ...config
    })
  },
  scanQrcode(qrcode) {
    return axios.get(`/login/ercode/${qrcode}`)
  }
}
