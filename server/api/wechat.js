import { getWechat, getOAuth } from '../wechat'

const wechatApi = getWechat()


export async function getSignatureAsync (url) {
 const data = await wechatApi.fetchAccessToken()
 const token = data.access_token
 const ticketData = await wechatApi.fetchTicket(token)
 const ticket = ticketData.ticket

 let params = wechatApi.sign(ticket, url)
 params.appId = wechatApi.appID

 return params
}

export function getAuthorizeURL (...args) {
 const oauth = getOAuth()

 return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const oauth = getOAuth()

  const data = await oauth.fetchAccessToken(code)
  console.log('-----token', data);
  
  const openid = data.openid
  const user = await oauth.getUserInfo(data.access_token, openid)

  return user
}
