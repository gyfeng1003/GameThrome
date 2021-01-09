import config from "../config";
import * as wechat from '../api/wechat'

export async function signature (ctx, next) {
 let url = ctx.query.url

 if (!url) ctx.throw(404)

 url = decodeURIComponent(url)
 let params = await wechat.getSignatureAsync(url)

 ctx.body = {
   success: 1,
   params: params
 }
}

// 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
// 用户被重定向到 Wechat Redirect URL 授权验证
// 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
export async function redirect (ctx, next) {
 let redirect = config.SITE_ROOT_URL + '/oauth'
 let scope = 'snsapi_userinfo'
 const {visit, id} = ctx.query
 const params = id ? `${visit}_${id}`: visit
 
 console.log('---------', redirect)
 const url = wechat.getAuthorizeURL(scope, redirect, params)
 
 ctx.redirect(url)
}
