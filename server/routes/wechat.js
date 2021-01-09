import {controller, get, log} from '../decorator/router'
import * as wechat from '../controller/wechat'
import wechatMiddle from '../wechat-lib/middleware'
import reply from '../wechat/reply'
import config from '../config'

@controller('')
export class WxController {
 @get('/wechat-hear')
 @log
 async wxHear (ctx, next) {
   const middle = wechatMiddle(config.wechat, reply)
   await middle(ctx, next)
 }
 
 @get('/wechat-signature')
 async wxSignature (ctx, next) {
   await wechat.signature(ctx, next)
 }
 
 @get('/wechat-redirect')
 async wxRedirect(ctx, next) {
  console.log('info redirect')
  await wechat.redirect(ctx, next)
 }
}
